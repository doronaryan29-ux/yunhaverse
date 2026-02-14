<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdminDataController extends Controller
{
    private const DEFAULT_APP_SETTINGS = [
        'app_name' => 'YunhaVerse',
        'logo_url' => null,
        'homepage_headline' => 'Welcome to YunhaVerse',
        'homepage_subheadline' => 'A place for creators to thrive.',
        'primary_color' => '#0f172a',
        'roles' => null,
        'audit_settings' => null,
    ];

    private function ensureAdmin(Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->input('requesterRole', $request->query('requesterRole', ''))));
        if ($requesterRole !== 'admin') {
            return response()->json(['message' => 'Admin access required.'], 403);
        }

        return null;
    }

    private function ensureAdminOrCreative(Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->input('requesterRole', $request->query('requesterRole', ''))));
        if (
            $requesterRole !== 'admin' &&
            !str_contains($requesterRole, 'creative') &&
            !str_contains($requesterRole, 'copywriter') &&
            !str_contains($requesterRole, 'sns')
        ) {
            return response()->json(['message' => 'Admin or creative access required.'], 403);
        }

        return null;
    }

    private function logCreativeRequestHistory(int $requestId, array $payload): void
    {
        if (!Schema::hasTable('creative_request_histories')) {
            return;
        }

        DB::table('creative_request_histories')->insert(array_merge([
            'request_id' => $requestId,
            'action' => 'request.updated',
            'created_at' => now(),
            'updated_at' => now(),
        ], $payload));
    }

    public function appSettings(Request $request)
    {
        $accessError = $this->ensureAdminOrCreative($request);
        if ($accessError) {
            return $accessError;
        }

        if (!Schema::hasTable('app_settings')) {
            return response()->json(self::DEFAULT_APP_SETTINGS);
        }

        $row = DB::table('app_settings')->orderBy('id')->first();

        if (!$row) {
            $id = DB::table('app_settings')->insertGetId(array_merge(
                self::DEFAULT_APP_SETTINGS,
                ['created_at' => now(), 'updated_at' => now()],
            ));
            $row = DB::table('app_settings')->where('id', $id)->first();
        }

        return response()->json([
            'id' => $row->id ?? null,
            'app_name' => $row->app_name ?? self::DEFAULT_APP_SETTINGS['app_name'],
            'logo_url' => $row->logo_url ?? null,
            'homepage_headline' => $row->homepage_headline ?? null,
            'homepage_subheadline' => $row->homepage_subheadline ?? null,
            'primary_color' => $row->primary_color ?? self::DEFAULT_APP_SETTINGS['primary_color'],
            'roles' => $row->roles ? json_decode($row->roles, true) : null,
            'audit_settings' => $row->audit_settings ? json_decode($row->audit_settings, true) : null,
            'updated_by' => $row->updated_by ?? null,
            'updated_at' => $row->updated_at ?? null,
        ]);
    }

    public function publicSettings()
    {
        if (!Schema::hasTable('app_settings')) {
            return response()->json(self::DEFAULT_APP_SETTINGS);
        }

        $row = DB::table('app_settings')->orderBy('id')->first();
        if (!$row) {
            $id = DB::table('app_settings')->insertGetId(array_merge(
                self::DEFAULT_APP_SETTINGS,
                ['created_at' => now(), 'updated_at' => now()],
            ));
            $row = DB::table('app_settings')->where('id', $id)->first();
        }

        return response()->json([
            'app_name' => $row->app_name ?? self::DEFAULT_APP_SETTINGS['app_name'],
            'logo_url' => $row->logo_url ?? null,
            'homepage_headline' => $row->homepage_headline ?? null,
            'homepage_subheadline' => $row->homepage_subheadline ?? null,
            'primary_color' => $row->primary_color ?? self::DEFAULT_APP_SETTINGS['primary_color'],
        ]);
    }

    public function updateAppSettings(Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('app_settings')) {
            return response()->json(['message' => 'Settings table not found.'], 500);
        }

        $payload = [
            'app_name' => trim((string) $request->input('app_name', self::DEFAULT_APP_SETTINGS['app_name'])),
            'logo_url' => $this->normalizeNullableString($request->input('logo_url')),
            'homepage_headline' => $this->normalizeNullableString($request->input('homepage_headline')),
            'homepage_subheadline' => $this->normalizeNullableString($request->input('homepage_subheadline')),
            'primary_color' => trim((string) $request->input('primary_color', self::DEFAULT_APP_SETTINGS['primary_color'])),
            'roles' => $this->normalizeJson($request->input('roles')),
            'audit_settings' => $this->normalizeJson($request->input('auditSettings', $request->input('audit_settings'))),
            'updated_by' => $request->input('updatedBy'),
            'updated_at' => now(),
        ];

        $row = DB::table('app_settings')->orderBy('id')->first();
        if ($row) {
            DB::table('app_settings')->where('id', $row->id)->update($payload);
            $rowId = $row->id;
        } else {
            $payload['created_at'] = now();
            $rowId = DB::table('app_settings')->insertGetId($payload);
        }

        $updated = DB::table('app_settings')->where('id', $rowId)->first();

        return response()->json([
            'id' => $updated->id ?? null,
            'app_name' => $updated->app_name ?? self::DEFAULT_APP_SETTINGS['app_name'],
            'logo_url' => $updated->logo_url ?? null,
            'homepage_headline' => $updated->homepage_headline ?? null,
            'homepage_subheadline' => $updated->homepage_subheadline ?? null,
            'primary_color' => $updated->primary_color ?? self::DEFAULT_APP_SETTINGS['primary_color'],
            'roles' => $updated->roles ? json_decode($updated->roles, true) : null,
            'audit_settings' => $updated->audit_settings ? json_decode($updated->audit_settings, true) : null,
            'updated_by' => $updated->updated_by ?? null,
            'updated_at' => $updated->updated_at ?? null,
        ]);
    }

    private function normalizeNullableString($value): ?string
    {
        $trimmed = trim((string) $value);
        return $trimmed === '' ? null : $trimmed;
    }

    private function normalizeJson($value): ?string
    {
        if ($value === null) {
            return null;
        }
        if (is_string($value)) {
            $trimmed = trim($value);
            return $trimmed === '' ? null : $trimmed;
        }

        return json_encode($value);
    }

    public function upcomingEvents(Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('events')) {
            return response()->json(['items' => []]);
        }

        $limit = max(1, min((int) $request->query('limit', 6), 20));
        $columns = Schema::getColumnListing('events');

        $titleColumn = in_array('title', $columns, true) ? 'title' : (in_array('name', $columns, true) ? 'name' : null);
        if (!$titleColumn) {
            return response()->json(['items' => []]);
        }

        $dateColumn = null;
        foreach (['start_at', 'event_date', 'start_date', 'date'] as $candidate) {
            if (in_array($candidate, $columns, true)) {
                $dateColumn = $candidate;
                break;
            }
        }

        $channelColumn = null;
        foreach (['channel', 'location', 'venue'] as $candidate) {
            if (in_array($candidate, $columns, true)) {
                $channelColumn = $candidate;
                break;
            }
        }

        $query = DB::table('events');
        if ($dateColumn) {
            $query->whereNotNull($dateColumn)->where($dateColumn, '>=', now())->orderBy($dateColumn);
        } else {
            $query->orderByDesc('created_at');
        }

        if (in_array('status', $columns, true)) {
            $query->whereRaw('LOWER(COALESCE(status, "")) IN (?, ?)', ['published', 'active']);
        }

        $rows = $query->limit($limit)->get();
        $items = $rows->map(function ($row) use ($titleColumn, $dateColumn, $channelColumn) {
            return [
                'id' => $row->id ?? null,
                'title' => (string) ($row->{$titleColumn} ?? 'Untitled Event'),
                'date' => $dateColumn ? ($row->{$dateColumn} ?? null) : null,
                'channel' => $channelColumn ? ($row->{$channelColumn} ?? '') : '',
            ];
        })->values();

        return response()->json(['items' => $items]);
    }

    public function membersCreativeStaff(Request $request)
    {
        $accessError = $this->ensureAdminOrCreative($request);
        if ($accessError) {
            return $accessError;
        }

        $requesterRole = strtolower(trim((string) $request->input('requesterRole', $request->query('requesterRole', ''))));
        $limit = max(1, min((int) $request->query('limit', 50), 300));
        $query = DB::table('users')
            ->select([
                'id',
                'email',
                'first_name',
                'last_name',
                'full_name',
                'role',
                'status',
                'created_at',
                'last_login_at',
            ])
            ->orderByDesc('created_at');

        // Admin directory should show all users; staff views stay scoped.
        if ($requesterRole !== 'admin') {
            $query->whereRaw(
                'LOWER(COALESCE(role, "")) IN (?, ?, ?, ?, ?)',
                ['member', 'creative', 'copywriter', 'sns_updater', 'sns updater']
            );
        }

        $rows = $query->limit($limit)->get();

        $lastLoginById = [];
        if (Schema::hasTable('audit_logs')) {
            $userIds = $rows->pluck('id')->filter()->values();
            if ($userIds->isNotEmpty()) {
                $loginActions = ['auth.login_success', 'auth.otp_verify_success', 'auth.google_login_success'];
                $auditRows = DB::table('audit_logs')
                    ->select(['entity_id', 'actor_user_id', 'created_at'])
                    ->whereIn('action', $loginActions)
                    ->where(function ($query) use ($userIds) {
                        $query->whereIn('entity_id', $userIds)
                            ->orWhereIn('actor_user_id', $userIds);
                    })
                    ->orderByDesc('created_at')
                    ->get();

                foreach ($auditRows as $auditRow) {
                    $userId = $auditRow->entity_id ?? $auditRow->actor_user_id;
                    if (!$userId) {
                        continue;
                    }
                    if (!isset($lastLoginById[$userId])) {
                        $lastLoginById[$userId] = $auditRow->created_at;
                    }
                }
            }
        }

        $items = $rows->map(function ($row) {
            $fullName = trim((string) ($row->full_name ?? ''));
            if (!$fullName) {
                $fullName = trim((string) ($row->first_name ?? '') . ' ' . (string) ($row->last_name ?? ''));
            }
            if (!$fullName) {
                $fullName = (string) ($row->email ?? 'Unknown user');
            }

            return [
                'id' => $row->id,
                'name' => $fullName,
                'email' => $row->email ?? null,
                'first_name' => $row->first_name ?? null,
                'last_name' => $row->last_name ?? null,
                'full_name' => $row->full_name ?? null,
                'role' => ucfirst(strtolower((string) ($row->role ?? 'member'))),
                'status' => ucfirst(strtolower((string) ($row->status ?? 'pending'))),
                'created_at' => $row->created_at,
                'joinedAt' => $row->created_at,
                'last_login_at' => $lastLoginById[$row->id] ?? $row->last_login_at ?? null,
            ];
        })->values();

        return response()->json(['items' => $items]);
    }

    public function creativeRequests(Request $request)
    {
        $accessError = $this->ensureAdminOrCreative($request);
        if ($accessError) {
            return $accessError;
        }

        if (!Schema::hasTable('creative_requests')) {
            return response()->json(['items' => []]);
        }

        $limit = max(1, min((int) $request->query('limit', 25), 200));
        $status = strtolower(trim((string) $request->query('status', '')));
        $stage = strtolower(trim((string) $request->query('stage', '')));
        $requestId = $request->query('requestId', $request->query('request_id'));
        $assignedTo = $request->query('assignedTo', $request->query('assigned_to'));

        $query = DB::table('creative_requests as cr')
            ->leftJoin('users as requester', 'cr.requested_by', '=', 'requester.id')
            ->leftJoin('users as assignee', 'cr.assigned_to', '=', 'assignee.id')
            ->leftJoin('users as submitter', 'cr.submitted_by', '=', 'submitter.id')
            ->select([
                'cr.id',
                'cr.title',
                'cr.description',
                'cr.submission_title',
                'cr.submission_url',
                'cr.submission_notes',
                'cr.submitted_by',
                'cr.submitted_at',
                'cr.review_note',
                'cr.requested_by',
                'cr.assigned_to',
                'cr.stage',
                'cr.status',
                'cr.priority',
                'cr.due_at',
                'cr.created_at',
                'cr.updated_at',
                'requester.email as requester_email',
                'requester.first_name as requester_first_name',
                'requester.last_name as requester_last_name',
                'requester.full_name as requester_full_name',
                'assignee.email as assignee_email',
                'assignee.first_name as assignee_first_name',
                'assignee.last_name as assignee_last_name',
                'assignee.full_name as assignee_full_name',
                'submitter.email as submitter_email',
                'submitter.first_name as submitter_first_name',
                'submitter.last_name as submitter_last_name',
                'submitter.full_name as submitter_full_name',
            ])
            ->orderByDesc('cr.created_at');

        if ($status) {
            $query->whereRaw('LOWER(COALESCE(cr.status, "")) = ?', [$status]);
        }
        if ($stage) {
            $query->whereRaw('LOWER(COALESCE(cr.stage, "")) = ?', [$stage]);
        }
        if ($assignedTo !== null && $assignedTo !== '') {
            $query->where('cr.assigned_to', (int) $assignedTo);
        }

        $rows = $query->limit($limit)->get();

        $items = $rows->map(function ($row) {
            $requesterName = trim((string) ($row->requester_full_name ?? ''));
            if (!$requesterName) {
                $requesterName = trim((string) ($row->requester_first_name ?? '') . ' ' . (string) ($row->requester_last_name ?? ''));
            }
            if (!$requesterName) {
                $requesterName = (string) ($row->requester_email ?? 'Unknown');
            }

            $assigneeName = trim((string) ($row->assignee_full_name ?? ''));
            if (!$assigneeName) {
                $assigneeName = trim((string) ($row->assignee_first_name ?? '') . ' ' . (string) ($row->assignee_last_name ?? ''));
            }
            if (!$assigneeName) {
                $assigneeName = (string) ($row->assignee_email ?? '');
            }

            $submitterName = trim((string) ($row->submitter_full_name ?? ''));
            if (!$submitterName) {
                $submitterName = trim((string) ($row->submitter_first_name ?? '') . ' ' . (string) ($row->submitter_last_name ?? ''));
            }
            if (!$submitterName) {
                $submitterName = (string) ($row->submitter_email ?? '');
            }

            return [
                'id' => $row->id,
                'title' => $row->title,
                'description' => $row->description,
                'submission_title' => $row->submission_title,
                'submission_url' => $row->submission_url,
                'submission_notes' => $row->submission_notes,
                'submitted_by' => $row->submitted_by,
                'submitted_by_name' => $submitterName,
                'submitted_at' => $row->submitted_at,
                'review_note' => $row->review_note,
                'requested_by' => $row->requested_by,
                'requested_by_name' => $requesterName,
                'assigned_to' => $row->assigned_to,
                'assigned_to_name' => $assigneeName,
                'stage' => $row->stage ?? 'creative',
                'status' => $row->status,
                'priority' => $row->priority,
                'due_at' => $row->due_at,
                'created_at' => $row->created_at,
                'updated_at' => $row->updated_at,
            ];
        })->values();

        return response()->json(['items' => $items]);
    }

    public function creativeRequestById(int $id, Request $request)
    {
        $accessError = $this->ensureAdminOrCreative($request);
        if ($accessError) {
            return $accessError;
        }

        if (!$request->expectsJson()) {
            return redirect('/#/staff');
        }

        if (!Schema::hasTable('creative_requests')) {
            return response()->json(['message' => 'creative_requests table is missing.'], 500);
        }

        $row = DB::table('creative_requests as cr')
            ->leftJoin('users as requester', 'cr.requested_by', '=', 'requester.id')
            ->leftJoin('users as assignee', 'cr.assigned_to', '=', 'assignee.id')
            ->leftJoin('users as submitter', 'cr.submitted_by', '=', 'submitter.id')
            ->select([
                'cr.id',
                'cr.title',
                'cr.description',
                'cr.submission_title',
                'cr.submission_url',
                'cr.submission_notes',
                'cr.submitted_by',
                'cr.submitted_at',
                'cr.review_note',
                'cr.requested_by',
                'cr.assigned_to',
                'cr.stage',
                'cr.status',
                'cr.priority',
                'cr.due_at',
                'cr.created_at',
                'cr.updated_at',
                'requester.email as requester_email',
                'requester.first_name as requester_first_name',
                'requester.last_name as requester_last_name',
                'requester.full_name as requester_full_name',
                'assignee.email as assignee_email',
                'assignee.first_name as assignee_first_name',
                'assignee.last_name as assignee_last_name',
                'assignee.full_name as assignee_full_name',
                'submitter.email as submitter_email',
                'submitter.first_name as submitter_first_name',
                'submitter.last_name as submitter_last_name',
                'submitter.full_name as submitter_full_name',
            ])
            ->where('cr.id', $id)
            ->first();

        if (!$row) {
            return response()->json(['message' => 'Request not found.'], 404);
        }

        $requesterName = trim((string) ($row->requester_full_name ?? ''));
        if (!$requesterName) {
            $requesterName = trim((string) ($row->requester_first_name ?? '') . ' ' . (string) ($row->requester_last_name ?? ''));
        }
        if (!$requesterName) {
            $requesterName = (string) ($row->requester_email ?? 'Unknown');
        }

        $assigneeName = trim((string) ($row->assignee_full_name ?? ''));
        if (!$assigneeName) {
            $assigneeName = trim((string) ($row->assignee_first_name ?? '') . ' ' . (string) ($row->assignee_last_name ?? ''));
        }
        if (!$assigneeName) {
            $assigneeName = (string) ($row->assignee_email ?? '');
        }

        $submitterName = trim((string) ($row->submitter_full_name ?? ''));
        if (!$submitterName) {
            $submitterName = trim((string) ($row->submitter_first_name ?? '') . ' ' . (string) ($row->submitter_last_name ?? ''));
        }
        if (!$submitterName) {
            $submitterName = (string) ($row->submitter_email ?? '');
        }

        return response()->json([
            'item' => [
                'id' => $row->id,
                'title' => $row->title,
                'description' => $row->description,
                'submission_title' => $row->submission_title,
                'submission_url' => $row->submission_url,
                'submission_notes' => $row->submission_notes,
                'submitted_by' => $row->submitted_by,
                'submitted_by_name' => $submitterName,
                'submitted_at' => $row->submitted_at,
                'review_note' => $row->review_note,
                'requested_by' => $row->requested_by,
                'requested_by_name' => $requesterName,
                'assigned_to' => $row->assigned_to,
                'assigned_to_name' => $assigneeName,
                'stage' => $row->stage ?? 'creative',
                'status' => $row->status,
                'priority' => $row->priority,
                'due_at' => $row->due_at,
                'created_at' => $row->created_at,
                'updated_at' => $row->updated_at,
            ],
        ]);
    }

    public function creativeSubmissions(Request $request)
    {
        $accessError = $this->ensureAdminOrCreative($request);
        if ($accessError) {
            return $accessError;
        }

        if (!Schema::hasTable('creative_submissions')) {
            return response()->json(['items' => []]);
        }

        $limit = max(1, min((int) $request->query('limit', 25), 200));
        $status = strtolower(trim((string) $request->query('status', '')));
        $stage = strtolower(trim((string) $request->query('stage', '')));
        $requestId = $request->query('requestId', $request->query('request_id'));

        $query = DB::table('creative_submissions as cs')
            ->leftJoin('creative_requests as cr', 'cs.request_id', '=', 'cr.id')
            ->leftJoin('users as submitter', 'cs.submitted_by', '=', 'submitter.id')
            ->select([
                'cs.id',
                'cs.request_id',
                'cs.title',
                'cs.submitted_by',
                'cs.submission_url',
                'cs.notes',
                'cs.stage',
                'cs.status',
                'cs.created_at',
                'cs.updated_at',
                'cr.title as request_title',
                'submitter.email as submitter_email',
                'submitter.first_name as submitter_first_name',
                'submitter.last_name as submitter_last_name',
                'submitter.full_name as submitter_full_name',
            ])
            ->orderByDesc('cs.created_at');

        if ($status) {
            $query->whereRaw('LOWER(COALESCE(cs.status, "")) = ?', [$status]);
        }
        if ($stage) {
            $query->whereRaw('LOWER(COALESCE(cs.stage, "")) = ?', [$stage]);
        }
        if ($requestId !== null && $requestId !== '') {
            $query->where('cs.request_id', (int) $requestId);
        }

        $rows = $query->limit($limit)->get();

        $items = $rows->map(function ($row) {
            $submitterName = trim((string) ($row->submitter_full_name ?? ''));
            if (!$submitterName) {
                $submitterName = trim((string) ($row->submitter_first_name ?? '') . ' ' . (string) ($row->submitter_last_name ?? ''));
            }
            if (!$submitterName) {
                $submitterName = (string) ($row->submitter_email ?? 'Unknown');
            }

            return [
                'id' => $row->id,
                'request_id' => $row->request_id,
                'request_title' => $row->request_title,
                'title' => $row->title,
                'submitted_by' => $row->submitted_by,
                'submitted_by_name' => $submitterName,
                'submission_url' => $row->submission_url,
                'notes' => $row->notes,
                'stage' => $row->stage ?? 'creative',
                'status' => $row->status,
                'created_at' => $row->created_at,
                'updated_at' => $row->updated_at,
            ];
        })->values();

        return response()->json(['items' => $items]);
    }

    public function creativeRequestHistory(int $id, Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('creative_request_histories')) {
            return response()->json(['items' => []]);
        }

        $rows = DB::table('creative_request_histories as history')
            ->leftJoin('users as actor', 'history.actor_user_id', '=', 'actor.id')
            ->select([
                'history.id',
                'history.action',
                'history.from_stage',
                'history.to_stage',
                'history.from_assigned_to',
                'history.to_assigned_to',
                'history.from_status',
                'history.to_status',
                'history.notes',
                'history.created_at',
                'actor.email as actor_email',
                'actor.first_name as actor_first_name',
                'actor.last_name as actor_last_name',
                'actor.full_name as actor_full_name',
            ])
            ->where('history.request_id', $id)
            ->orderByDesc('history.created_at')
            ->limit(50)
            ->get();

        $items = $rows->map(function ($row) {
            $actorName = trim((string) ($row->actor_full_name ?? ''));
            if (!$actorName) {
                $actorName = trim((string) ($row->actor_first_name ?? '') . ' ' . (string) ($row->actor_last_name ?? ''));
            }
            if (!$actorName) {
                $actorName = (string) ($row->actor_email ?? '');
            }

            return [
                'id' => $row->id,
                'action' => $row->action,
                'from_stage' => $row->from_stage,
                'to_stage' => $row->to_stage,
                'from_assigned_to' => $row->from_assigned_to,
                'to_assigned_to' => $row->to_assigned_to,
                'from_status' => $row->from_status,
                'to_status' => $row->to_status,
                'notes' => $row->notes,
                'created_at' => $row->created_at,
                'actor_name' => $actorName,
            ];
        })->values();

        return response()->json(['items' => $items]);
    }

    public function storeCreativeRequest(Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('creative_requests')) {
            return response()->json(['message' => 'creative_requests table is missing.'], 500);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'description' => ['nullable', 'string'],
            'requestedBy' => ['nullable', 'integer'],
            'assignedTo' => ['nullable', 'integer'],
            'stage' => ['nullable', 'string', 'max:40'],
            'status' => ['nullable', 'string', 'max:40'],
            'priority' => ['nullable', 'string', 'max:20'],
            'dueAt' => ['nullable', 'date'],
        ]);

        $id = DB::table('creative_requests')->insertGetId([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'requested_by' => $validated['requestedBy'] ?? null,
            'assigned_to' => $validated['assignedTo'] ?? null,
            'stage' => $validated['stage'] ?? 'creative',
            'status' => $validated['status'] ?? 'open',
            'priority' => $validated['priority'] ?? 'medium',
            'due_at' => $validated['dueAt'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->logCreativeRequestHistory($id, [
            'action' => 'request.created',
            'to_stage' => $validated['stage'] ?? 'creative',
            'to_assigned_to' => $validated['assignedTo'] ?? null,
            'to_status' => $validated['status'] ?? 'open',
            'actor_user_id' => $validated['requestedBy'] ?? null,
            'notes' => $validated['description'] ?? null,
        ]);

        if (!empty($validated['assignedTo']) && Schema::hasTable('notifications')) {
            DB::table('notifications')->insert([
                'title' => 'New assignment: ' . $validated['title'],
                'message' => $validated['description'] ?? 'A new creative task has been assigned.',
                'type' => 'announcement',
                'audience' => 'members',
                'priority' => 'normal',
                'status' => 'published',
                'publish_at' => now(),
                'created_by' => $validated['requestedBy'] ?? null,
                'user_id' => (int) $validated['assignedTo'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Request created.', 'id' => $id], 201);
    }

    public function updateCreativeRequest(int $id, Request $request)
    {
        $accessError = $this->ensureAdminOrCreative($request);
        if ($accessError) {
            return $accessError;
        }

        if (!Schema::hasTable('creative_requests')) {
            return response()->json(['message' => 'creative_requests table is missing.'], 500);
        }

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:190'],
            'description' => ['nullable', 'string'],
            'requestedBy' => ['nullable', 'integer'],
            'assignedTo' => ['nullable', 'integer'],
            'stage' => ['nullable', 'string', 'max:40'],
            'status' => ['nullable', 'string', 'max:40'],
            'priority' => ['nullable', 'string', 'max:20'],
            'dueAt' => ['nullable', 'date'],
            'updatedBy' => ['nullable', 'integer'],
            'submissionTitle' => ['nullable', 'string', 'max:190'],
            'submissionUrl' => ['nullable', 'string', 'max:255'],
            'submissionNotes' => ['nullable', 'string'],
            'submittedBy' => ['nullable', 'integer'],
            'submittedAt' => ['nullable', 'date'],
            'reviewNote' => ['nullable', 'string'],
        ]);

        $payload = [];
        $fieldMap = [
            'title' => 'title',
            'description' => 'description',
            'requestedBy' => 'requested_by',
            'assignedTo' => 'assigned_to',
            'stage' => 'stage',
            'status' => 'status',
            'priority' => 'priority',
            'dueAt' => 'due_at',
            'submissionTitle' => 'submission_title',
            'submissionUrl' => 'submission_url',
            'submissionNotes' => 'submission_notes',
            'submittedBy' => 'submitted_by',
            'submittedAt' => 'submitted_at',
            'reviewNote' => 'review_note',
        ];

        foreach ($fieldMap as $inputKey => $column) {
            if (array_key_exists($inputKey, $validated)) {
                $payload[$column] = $validated[$inputKey];
            }
        }

        $requesterRole = strtolower(trim((string) $request->input('requesterRole', $request->query('requesterRole', ''))));
        $isAdmin = $requesterRole === 'admin' || str_contains($requesterRole, 'admin');
        if (!$isAdmin) {
            $allowedKeys = [
                'submission_title',
                'submission_url',
                'submission_notes',
                'submitted_by',
                'submitted_at',
                'status',
            ];
            $payload = array_intersect_key($payload, array_flip($allowedKeys));
            $statusValue = strtolower(trim((string) ($payload['status'] ?? 'submitted')));
            $payload['status'] = $statusValue === 'submitted' ? 'submitted' : 'submitted';
            if (empty($payload['submitted_at'])) {
                $payload['submitted_at'] = now();
            }
        }

        if (array_key_exists('submitted_at', $payload) && !empty($payload['submitted_at'])) {
            $timestamp = strtotime((string) $payload['submitted_at']);
            $payload['submitted_at'] = $timestamp
                ? date('Y-m-d H:i:s', $timestamp)
                : now()->toDateTimeString();
        }

        if (empty($payload)) {
            return response()->json(['message' => 'No changes provided.'], 400);
        }

        $payload['updated_at'] = now();

        $existing = DB::table('creative_requests')->where('id', $id)->first();
        $updated = DB::table('creative_requests')->where('id', $id)->update($payload);
        if (!$updated) {
            return response()->json(['message' => 'Request not found.'], 404);
        }

        $nextStage = $payload['stage'] ?? null;
        $nextAssignee = $payload['assigned_to'] ?? null;
        $nextStatus = $payload['status'] ?? null;
        if ($existing) {
            $stageChanged = $nextStage !== null && $nextStage !== $existing->stage;
            $assigneeChanged = array_key_exists('assigned_to', $payload) && $nextAssignee !== $existing->assigned_to;
            $statusChanged = $nextStatus !== null && $nextStatus !== $existing->status;

            if ($stageChanged || $assigneeChanged || $statusChanged) {
                $action = 'request.updated';
                $normalizedStatus = strtolower(trim((string) ($nextStatus ?? '')));
                if ($stageChanged) {
                    $action = 'request.handoff';
                } elseif ($statusChanged) {
                    if ($normalizedStatus === 'submitted') {
                        $action = 'submission.created';
                    } elseif ($normalizedStatus === 'revision_requested') {
                        $action = 'review.revision';
                    } elseif ($normalizedStatus === 'declined') {
                        $action = 'review.decline';
                    } elseif ($normalizedStatus === 'completed') {
                        $action = 'request.completed';
                    }
                }

                $this->logCreativeRequestHistory($id, [
                    'action' => $action,
                    'from_stage' => $existing->stage ?? null,
                    'to_stage' => $nextStage ?? $existing->stage,
                    'from_assigned_to' => $existing->assigned_to ?? null,
                    'to_assigned_to' => $assigneeChanged ? $nextAssignee : $existing->assigned_to,
                    'from_status' => $existing->status ?? null,
                    'to_status' => $nextStatus ?? $existing->status,
                    'actor_user_id' => $validated['updatedBy'] ?? $validated['submittedBy'] ?? null,
                    'notes' => $payload['review_note'] ?? $payload['submission_notes'] ?? $payload['description'] ?? null,
                ]);
            }
        }

        if (
            array_key_exists('assigned_to', $payload) &&
            !empty($payload['assigned_to']) &&
            Schema::hasTable('notifications')
        ) {
            $previousAssignee = $existing?->assigned_to;
            $nextAssignee = $payload['assigned_to'];
            if ($previousAssignee !== $nextAssignee) {
                $title = array_key_exists('title', $payload)
                    ? $payload['title']
                    : ($existing->title ?? 'New assignment');
                $message = array_key_exists('description', $payload)
                    ? ($payload['description'] ?? '')
                    : ($existing->description ?? 'A new creative task has been assigned.');

                DB::table('notifications')->insert([
                    'title' => 'New assignment: ' . $title,
                    'message' => $message ?: 'A new creative task has been assigned.',
                    'type' => 'announcement',
                    'audience' => 'members',
                    'priority' => 'normal',
                    'status' => 'published',
                    'publish_at' => now(),
                    'created_by' => $payload['requested_by'] ?? $existing?->requested_by ?? null,
                    'user_id' => (int) $nextAssignee,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        return response()->json(['message' => 'Request updated.']);
    }

    public function storeCreativeSubmission(Request $request)
    {
        $accessError = $this->ensureAdminOrCreative($request);
        if ($accessError) {
            return $accessError;
        }

        if (!Schema::hasTable('creative_submissions')) {
            return response()->json(['message' => 'creative_submissions table is missing.'], 500);
        }

        $validated = $request->validate([
            'requestId' => ['nullable', 'integer'],
            'title' => ['required', 'string', 'max:190'],
            'submittedBy' => ['nullable', 'integer'],
            'submissionUrl' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'stage' => ['nullable', 'string', 'max:40'],
            'status' => ['nullable', 'string', 'max:40'],
        ]);

        $stage = $validated['stage'] ?? null;
        if (!$stage && !empty($validated['requestId'])) {
            $requestRow = DB::table('creative_requests')
                ->select(['stage'])
                ->where('id', $validated['requestId'])
                ->first();
            if ($requestRow && !empty($requestRow->stage)) {
                $stage = $requestRow->stage;
            }
        }

        $id = DB::table('creative_submissions')->insertGetId([
            'request_id' => $validated['requestId'] ?? null,
            'title' => $validated['title'],
            'submitted_by' => $validated['submittedBy'] ?? null,
            'submission_url' => $validated['submissionUrl'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'stage' => $stage ?? 'creative',
            'status' => $validated['status'] ?? 'pending_review',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if (!empty($validated['requestId'])) {
            $this->logCreativeRequestHistory((int) $validated['requestId'], [
                'action' => 'submission.created',
                'to_stage' => $stage ?? 'creative',
                'to_status' => $validated['status'] ?? 'pending_review',
                'actor_user_id' => $validated['submittedBy'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);
        }

        return response()->json(['message' => 'Submission created.', 'id' => $id], 201);
    }

    public function updateCreativeSubmission(int $id, Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('creative_submissions')) {
            return response()->json(['message' => 'creative_submissions table is missing.'], 500);
        }

        $validated = $request->validate([
            'requestId' => ['nullable', 'integer'],
            'title' => ['nullable', 'string', 'max:190'],
            'submittedBy' => ['nullable', 'integer'],
            'submissionUrl' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'stage' => ['nullable', 'string', 'max:40'],
            'status' => ['nullable', 'string', 'max:40'],
        ]);

        $payload = [];
        $fieldMap = [
            'requestId' => 'request_id',
            'title' => 'title',
            'submittedBy' => 'submitted_by',
            'submissionUrl' => 'submission_url',
            'notes' => 'notes',
            'stage' => 'stage',
            'status' => 'status',
        ];

        foreach ($fieldMap as $inputKey => $column) {
            if (array_key_exists($inputKey, $validated)) {
                $payload[$column] = $validated[$inputKey];
            }
        }

        if (empty($payload)) {
            return response()->json(['message' => 'No changes provided.'], 400);
        }

        $payload['updated_at'] = now();

        $updated = DB::table('creative_submissions')->where('id', $id)->update($payload);
        if (!$updated) {
            return response()->json(['message' => 'Submission not found.'], 404);
        }

        return response()->json(['message' => 'Submission updated.']);
    }

    public function deleteCreativeRequest(int $id, Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('creative_requests')) {
            return response()->json(['message' => 'creative_requests table is missing.'], 500);
        }

        $deleted = DB::table('creative_requests')->where('id', $id)->delete();
        if (!$deleted) {
            return response()->json(['message' => 'Request not found.'], 404);
        }

        return response()->json(['message' => 'Request deleted.']);
    }

    public function deleteCreativeSubmission(int $id, Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('creative_submissions')) {
            return response()->json(['message' => 'creative_submissions table is missing.'], 500);
        }

        $deleted = DB::table('creative_submissions')->where('id', $id)->delete();
        if (!$deleted) {
            return response()->json(['message' => 'Submission not found.'], 404);
        }

        return response()->json(['message' => 'Submission deleted.']);
    }

    public function donations(Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('donations')) {
            return response()->json(['items' => []]);
        }

        $limit = max(1, min((int) $request->query('limit', 50), 200));
        $rows = DB::table('donations as d')
            ->leftJoin('users as u', 'd.user_id', '=', 'u.id')
            ->select([
                'd.id',
                'd.user_id',
                'd.name',
                'd.email',
                'd.amount',
                'd.currency',
                'd.channel',
                'd.status',
                'd.created_at',
                'u.first_name as user_first_name',
                'u.last_name as user_last_name',
                'u.full_name as user_full_name',
                'u.email as user_email',
            ])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
        $items = $rows->map(function ($row) {
            $userName = trim((string) ($row->user_full_name ?? ''));
            if (!$userName) {
                $userName = trim((string) ($row->user_first_name ?? '') . ' ' . (string) ($row->user_last_name ?? ''));
            }
            $displayName = $userName ?: ($row->name ?: ($row->user_email ?: $row->email));

            return [
                'id' => $row->id,
                'user_id' => $row->user_id,
                'name' => $displayName,
                'email' => $row->email ?? $row->user_email,
                'amount' => $row->amount,
                'currency' => $row->currency,
                'channel' => $row->channel,
                'status' => $row->status,
                'created_at' => $row->created_at,
            ];
        })->values();

        return response()->json(['items' => $items]);
    }

    public function events(Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('events')) {
            return response()->json(['items' => []]);
        }

        $limit = max(1, min((int) $request->query('limit', 100), 300));
        $columns = Schema::getColumnListing('events');

        $selectColumns = array_values(array_intersect([
            'id',
            'title',
            'description',
            'start_at',
            'end_at',
            'location',
            'timezone',
            'image_url',
            'link_url',
            'type',
            'status',
        ], $columns));

        $rows = DB::table('events')
            ->select($selectColumns)
            ->orderByDesc(in_array('start_at', $columns, true) ? 'start_at' : 'created_at')
            ->limit($limit)
            ->get();

        $items = $rows->map(function ($row) {
            return [
                'id' => $row->id ?? null,
                'title' => $row->title ?? '',
                'description' => $row->description ?? null,
                'start_at' => $row->start_at ?? null,
                'end_at' => $row->end_at ?? null,
                'location' => $row->location ?? '',
                'timezone' => $row->timezone ?? null,
                'image_url' => $row->image_url ?? null,
                'link_url' => $row->link_url ?? null,
                'type' => $row->type ?? 'streaming',
                'status' => $row->status ?? 'published',
                // keep compatibility for existing UI usages
                'date' => $row->start_at ?? null,
                'channel' => $row->location ?? '',
            ];
        })->values();

        return response()->json(['items' => $items]);
    }

    public function publicEvents(Request $request)
    {
        if (!Schema::hasTable('events')) {
            return response()->json(['items' => []]);
        }

        $limit = max(1, min((int) $request->query('limit', 100), 300));
        $columns = Schema::getColumnListing('events');

        $selectColumns = array_values(array_intersect([
            'id',
            'title',
            'description',
            'start_at',
            'end_at',
            'location',
            'timezone',
            'image_url',
            'link_url',
            'type',
            'status',
        ], $columns));

        $query = DB::table('events')->select($selectColumns);
        if (in_array('status', $columns, true)) {
            $query->whereRaw('LOWER(COALESCE(status, "")) IN (?, ?)', ['published', 'active']);
        }

        $rows = $query
            ->orderByDesc(in_array('start_at', $columns, true) ? 'start_at' : 'created_at')
            ->limit($limit)
            ->get();

        $items = $rows->map(function ($row) {
            return [
                'id' => $row->id ?? null,
                'title' => $row->title ?? '',
                'description' => $row->description ?? null,
                'start_at' => $row->start_at ?? null,
                'end_at' => $row->end_at ?? null,
                'location' => $row->location ?? '',
                'timezone' => $row->timezone ?? null,
                'image_url' => $row->image_url ?? null,
                'link_url' => $row->link_url ?? null,
                'type' => $row->type ?? 'streaming',
                'status' => $row->status ?? 'published',
                // keep compatibility for existing UI usages
                'date' => $row->start_at ?? null,
                'channel' => $row->location ?? '',
            ];
        })->values();

        return response()->json(['items' => $items]);
    }

    public function storeEvent(Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('events')) {
            return response()->json(['message' => 'events table is missing.'], 500);
        }

        $columns = Schema::getColumnListing('events');
        if (!in_array('title', $columns, true)) {
            return response()->json(['message' => 'events table missing title column.'], 500);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'description' => ['nullable', 'string'],
            'startAt' => ['nullable', 'date'],
            'endAt' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'imageUrl' => ['nullable', 'string', 'max:500'],
            'linkUrl' => ['nullable', 'string', 'max:500'],
            'type' => ['nullable', 'string', 'max:40'],
            'status' => ['nullable', 'string', 'max:40'],
        ]);

        $payload = ['title' => $validated['title']];
        $fieldMap = [
            'description' => 'description',
            'startAt' => 'start_at',
            'endAt' => 'end_at',
            'location' => 'location',
            'timezone' => 'timezone',
            'imageUrl' => 'image_url',
            'linkUrl' => 'link_url',
            'type' => 'type',
            'status' => 'status',
        ];
        foreach ($fieldMap as $inputKey => $column) {
            if (array_key_exists($inputKey, $validated) && in_array($column, $columns, true)) {
                $payload[$column] = $validated[$inputKey];
            }
        }
        if (in_array('created_at', $columns, true)) {
            $payload['created_at'] = now();
        }
        if (in_array('updated_at', $columns, true)) {
            $payload['updated_at'] = now();
        }

        $id = DB::table('events')->insertGetId($payload);

        return response()->json(['message' => 'Event created.', 'id' => $id], 201);
    }

    public function updateEvent(int $id, Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('events')) {
            return response()->json(['message' => 'events table is missing.'], 500);
        }

        $columns = Schema::getColumnListing('events');
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:190'],
            'description' => ['nullable', 'string'],
            'startAt' => ['nullable', 'date'],
            'endAt' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'imageUrl' => ['nullable', 'string', 'max:500'],
            'linkUrl' => ['nullable', 'string', 'max:500'],
            'type' => ['nullable', 'string', 'max:40'],
            'status' => ['nullable', 'string', 'max:40'],
        ]);

        $payload = [];
        $fieldMap = [
            'title' => 'title',
            'description' => 'description',
            'startAt' => 'start_at',
            'endAt' => 'end_at',
            'location' => 'location',
            'timezone' => 'timezone',
            'imageUrl' => 'image_url',
            'linkUrl' => 'link_url',
            'type' => 'type',
            'status' => 'status',
        ];
        foreach ($fieldMap as $inputKey => $column) {
            if (array_key_exists($inputKey, $validated) && in_array($column, $columns, true)) {
                $payload[$column] = $validated[$inputKey];
            }
        }
        if (empty($payload)) {
            return response()->json(['message' => 'No changes provided.'], 400);
        }
        if (in_array('updated_at', $columns, true)) {
            $payload['updated_at'] = now();
        }

        $updated = DB::table('events')->where('id', $id)->update($payload);
        if (!$updated) {
            return response()->json(['message' => 'Event not found.'], 404);
        }

        return response()->json(['message' => 'Event updated.']);
    }

    public function deleteEvent(int $id, Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('events')) {
            return response()->json(['message' => 'events table is missing.'], 500);
        }

        $deleted = DB::table('events')->where('id', $id)->delete();
        if (!$deleted) {
            return response()->json(['message' => 'Event not found.'], 404);
        }

        return response()->json(['message' => 'Event deleted.']);
    }
}
