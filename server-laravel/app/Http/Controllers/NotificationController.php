<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Throwable;
use App\Support\AuditLog;
use App\Support\AuditFlag;

class NotificationController extends Controller
{
    public function adminStats(Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->query('requesterRole', '')));
        if ($requesterRole !== 'admin') {
            return response()->json(['message' => 'Admin access required.'], 403);
        }

        $activeMembers = DB::table('users')
            ->whereRaw("LOWER(COALESCE(status, '')) = ?", ['active'])
            ->whereRaw("LOWER(COALESCE(role, '')) = ?", ['member'])
            ->count();

        $creativeStaff = DB::table('users')
            ->whereRaw("LOWER(COALESCE(status, '')) = ?", ['active'])
            ->whereRaw("LOWER(COALESCE(role, '')) IN (?, ?, ?, ?, ?, ?)", ['creative', 'creator', 'staff', 'copywriter', 'sns_updater', 'sns updater'])
            ->count();

        $openAuditFlags = 0;
        $resolvedAuditFlags = 0;
        $totalAuditFlags = 0;
        if (Schema::hasTable('audit_flags')) {
            $openAuditFlags = DB::table('audit_flags')
                ->whereRaw("LOWER(COALESCE(status, '')) = ?", ['open'])
                ->count();
            $resolvedAuditFlags = DB::table('audit_flags')
                ->whereRaw("LOWER(COALESCE(status, '')) = ?", ['resolved'])
                ->count();
            $totalAuditFlags = DB::table('audit_flags')->count();
        }

        $totalMembers = DB::table('users')->count();
        $inactiveMembers = DB::table('users')
            ->whereRaw("LOWER(COALESCE(status, '')) != ?", ['active'])
            ->count();
        $verifiedMembers = DB::table('users')->whereNotNull('email_verified_at')->count();
        $pendingVerification = max(0, $totalMembers - $verifiedMembers);

        $successfulStatuses = ['completed', 'paid', 'success', 'succeeded'];
        $now = now();
        $donationsThisMonth = (float) DB::table('donations')
            ->where(function ($query) use ($successfulStatuses) {
                $query->whereNull('status')
                    ->orWhereRaw(
                        "LOWER(TRIM(COALESCE(status, ''))) IN (?, ?, ?, ?)",
                        $successfulStatuses
                    );
            })
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->sum('amount');
        $monthlyDonationGoal = 10000;

        $weekStarts = [];
        for ($i = 7; $i >= 0; $i--) {
            $weekStarts[] = $now->copy()->startOfWeek()->subWeeks($i)->format('Y-m-d');
        }

        $memberGrowthWeekly = $this->weeklySeries('users', 'created_at', $weekStarts);
        $runningTotal = $totalMembers - array_sum(array_column($memberGrowthWeekly, 'count'));
        $memberGrowth = [];
        foreach ($memberGrowthWeekly as $bucket) {
            $runningTotal += $bucket['count'];
            $memberGrowth[] = [
                'period' => $bucket['period'],
                'newMembers' => $bucket['count'],
                'totalMembers' => $runningTotal,
            ];
        }

        $auditActivityTrend = Schema::hasTable('audit_logs')
            ? array_map(
                fn ($bucket) => ['period' => $bucket['period'], 'count' => $bucket['count']],
                $this->weeklySeries('audit_logs', 'created_at', $weekStarts)
            )
            : array_map(fn ($w) => ['period' => $w, 'count' => 0], $weekStarts);

        return response()->json([
            'activeMembers' => $activeMembers,
            'creativeStaff' => $creativeStaff,
            'openAuditFlags' => $openAuditFlags,
            'memberBreakdown' => [
                'activeMembers' => $activeMembers,
                'creativeStaff' => $creativeStaff,
                'inactive' => $inactiveMembers,
                'pendingVerification' => $pendingVerification,
                'totalMembers' => $totalMembers,
            ],
            'memberGrowth' => $memberGrowth,
            'auditActivityTrend' => $auditActivityTrend,
            'goals' => [
                'donations' => [
                    'current' => $donationsThisMonth,
                    'goal' => $monthlyDonationGoal,
                    'progress' => $monthlyDonationGoal > 0
                        ? (int) min(100, round($donationsThisMonth / $monthlyDonationGoal * 100))
                        : 0,
                ],
                'flagsResolved' => [
                    'resolved' => $resolvedAuditFlags,
                    'total' => $totalAuditFlags,
                    'progress' => $totalAuditFlags > 0
                        ? (int) round($resolvedAuditFlags / $totalAuditFlags * 100)
                        : 100,
                ],
                'verification' => [
                    'verified' => $verifiedMembers,
                    'total' => $totalMembers,
                    'progress' => $totalMembers > 0
                        ? (int) round($verifiedMembers / $totalMembers * 100)
                        : 0,
                ],
            ],
        ]);
    }

    private function weeklySeries(string $table, string $dateColumn, array $weekStarts): array
    {
        $windowStart = \Carbon\Carbon::parse($weekStarts[0]);
        $rows = DB::table($table)
            ->select($dateColumn)
            ->where($dateColumn, '>=', $windowStart)
            ->get();

        $buckets = array_fill_keys($weekStarts, 0);
        foreach ($rows as $row) {
            $weekStart = \Carbon\Carbon::parse($row->{$dateColumn})->startOfWeek()->format('Y-m-d');
            if (array_key_exists($weekStart, $buckets)) {
                $buckets[$weekStart]++;
            }
        }

        $result = [];
        foreach ($weekStarts as $w) {
            $result[] = ['period' => $w, 'count' => $buckets[$w]];
        }

        return $result;
    }

    public function index(Request $request)
    {
        $userId = (int) $request->query('user_id', 0);
        $role = strtolower(trim((string) $request->query('role', 'member')));
        $limit = max(1, min((int) $request->query('limit', 10), 30));
        $now = now();

        $audiences = ['all'];
        if ($role === 'admin') {
            $audiences[] = 'admins';
        } else {
            $audiences[] = 'members';
        }

        $baseQuery = DB::table('notifications')
            ->where('status', 'published')
            ->where(function ($query) use ($audiences, $userId) {
                $query->where(function ($subQuery) use ($audiences) {
                    $subQuery->whereNull('user_id')->whereIn('audience', $audiences);
                });
                if ($userId > 0) {
                    $query->orWhere('user_id', $userId);
                }
            })
            ->where(function ($query) use ($now) {
                $query->whereNull('publish_at')->orWhere('publish_at', '<=', $now);
            })
            ->where(function ($query) use ($now) {
                $query->whereNull('expires_at')->orWhere('expires_at', '>', $now);
            });

        $notifications = $baseQuery
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        $readMap = [];
        if ($userId > 0) {
            $readIds = DB::table('notification_reads')
                ->where('user_id', $userId)
                ->pluck('notification_id')
                ->all();

            foreach ($readIds as $readId) {
                $readMap[(int) $readId] = true;
            }
        }

        $items = $notifications->map(function ($item) use ($readMap) {
            $item->isRead = isset($readMap[(int) $item->id]);
            return $item;
        });

        $unreadCount = $items->where('isRead', false)->count();

        return response()->json([
            'unreadCount' => $unreadCount,
            'items' => $items->values(),
        ]);
    }

    public function store(Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->input('requesterRole', '')));
        $createdBy = $request->input('createdBy');
        $actorId = is_numeric($createdBy) ? (int) $createdBy : null;

        if ($requesterRole !== 'admin') {
            $flagId = AuditFlag::open(
                'Notification publish failure',
                'Unauthorized notification publish attempt. requesterRole=' . ($requesterRole ?: 'unknown'),
                'high',
                $actorId
            );
            if ($flagId) {
                AuditLog::write(
                    'audit_flag.opened',
                    'audit_flag',
                    (int) $flagId,
                    $actorId,
                    null,
                    $requesterRole ?: null,
                    [],
                    ['trigger' => 'notification_publish_failure', 'reason' => 'unauthorized'],
                    $request
                );
            }
            return response()->json(['message' => 'Admin access required.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:160'],
            'message' => ['required', 'string', 'max:3000'],
            'type' => ['required', 'in:announcement,discord_meetup,funds_alert,audit_alert'],
            'audience' => ['required', 'in:all,admins,members'],
            'priority' => ['required', 'in:low,normal,high'],
            'publishAt' => ['nullable', 'date'],
            'expiresAt' => ['nullable', 'date'],
            'createdBy' => ['nullable', 'integer'],
            'userId' => ['nullable', 'integer'],
        ]);
        if ($validator->fails()) {
            $flagId = AuditFlag::open(
                'Notification publish failure',
                'Validation failed while publishing notification.',
                'medium',
                $actorId
            );
            if ($flagId) {
                AuditLog::write(
                    'audit_flag.opened',
                    'audit_flag',
                    (int) $flagId,
                    $actorId,
                    null,
                    $requesterRole,
                    [],
                    ['trigger' => 'notification_publish_failure', 'reason' => 'validation_failed'],
                    $request
                );
            }
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }
        $validated = $validator->validated();

        try {
            $notificationId = DB::table('notifications')->insertGetId([
                'title' => $validated['title'],
                'message' => $validated['message'],
                'type' => $validated['type'],
                'audience' => $validated['audience'],
                'priority' => $validated['priority'],
                'status' => 'published',
                'publish_at' => $validated['publishAt'] ?? null,
                'expires_at' => $validated['expiresAt'] ?? null,
                'created_by' => $validated['createdBy'] ?? null,
                'user_id' => $validated['userId'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (Throwable $error) {
            $flagId = AuditFlag::open(
                'Notification publish failure',
                'Database error while publishing notification: ' . $error->getMessage(),
                'critical',
                $actorId
            );
            if ($flagId) {
                AuditLog::write(
                    'audit_flag.opened',
                    'audit_flag',
                    (int) $flagId,
                    $actorId,
                    null,
                    $requesterRole,
                    [],
                    [
                        'trigger' => 'notification_publish_failure',
                        'reason' => 'db_exception',
                        'error' => $error->getMessage(),
                    ],
                    $request
                );
            }
            return response()->json(['message' => 'Failed to publish notification.'], 500);
        }

        AuditLog::write(
            'notification.created',
            'notification',
            (int) $notificationId,
            isset($validated['createdBy']) ? (int) $validated['createdBy'] : null,
            null,
            $requesterRole,
            [],
            [
                'title' => $validated['title'],
                'type' => $validated['type'],
                'audience' => $validated['audience'],
                'priority' => $validated['priority'],
            ],
            $request
        );

        return response()->json([
            'message' => 'Notification created.',
            'id' => $notificationId,
        ]);
    }

    public function markRead(Request $request, int $id)
    {
        $notification = DB::table('notifications')->where('id', $id)->first();
        if (!$notification) {
            return response()->json(['message' => 'Notification not found.'], 404);
        }

        $userId = (int) $request->input('userId', 0);
        if ($userId <= 0) {
            return response()->json(['message' => 'Valid userId is required.'], 400);
        }

        DB::table('notification_reads')->upsert(
            [
                [
                    'notification_id' => $id,
                    'user_id' => $userId,
                    'read_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ],
            ['notification_id', 'user_id'],
            ['read_at', 'updated_at']
        );

        AuditLog::write(
            'notification.read',
            'notification',
            $id,
            $userId,
            null,
            null,
            [],
            ['read_at' => now()->toDateTimeString()],
            $request
        );

        return response()->json(['message' => 'Marked as read.']);
    }
}
