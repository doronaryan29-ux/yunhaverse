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
            ->whereRaw('LOWER(COALESCE(status, "")) = ?', ['active'])
            ->whereRaw('LOWER(COALESCE(role, "")) = ?', ['member'])
            ->count();

        $creativeStaff = DB::table('users')
            ->whereRaw('LOWER(COALESCE(status, "")) = ?', ['active'])
            ->whereRaw('LOWER(COALESCE(role, "")) IN (?, ?, ?)', ['creative', 'creator', 'staff'])
            ->count();

        $openAuditFlags = 0;
        if (Schema::hasTable('audit_flags')) {
            $openAuditFlags = DB::table('audit_flags')
                ->whereRaw('LOWER(COALESCE(status, "")) = ?', ['open'])
                ->count();
        }

        return response()->json([
            'activeMembers' => $activeMembers,
            'creativeStaff' => $creativeStaff,
            'openAuditFlags' => $openAuditFlags,
        ]);
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
            ->whereIn('audience', $audiences)
            ->where('status', 'published')
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
