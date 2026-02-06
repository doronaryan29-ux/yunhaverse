<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdminDataController extends Controller
{
    private function ensureAdmin(Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->input('requesterRole', $request->query('requesterRole', ''))));
        if ($requesterRole !== 'admin') {
            return response()->json(['message' => 'Admin access required.'], 403);
        }

        return null;
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
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        $limit = max(1, min((int) $request->query('limit', 8), 30));
        $rows = DB::table('users')
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
            ->whereRaw('LOWER(COALESCE(role, "")) IN (?, ?)', ['member', 'creative'])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

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
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('creative_requests')) {
            return response()->json(['items' => []]);
        }

        $limit = max(1, min((int) $request->query('limit', 25), 200));
        $status = strtolower(trim((string) $request->query('status', '')));

        $query = DB::table('creative_requests as cr')
            ->leftJoin('users as requester', 'cr.requested_by', '=', 'requester.id')
            ->leftJoin('users as assignee', 'cr.assigned_to', '=', 'assignee.id')
            ->select([
                'cr.id',
                'cr.title',
                'cr.description',
                'cr.requested_by',
                'cr.assigned_to',
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
            ])
            ->orderByDesc('cr.created_at');

        if ($status) {
            $query->whereRaw('LOWER(COALESCE(cr.status, "")) = ?', [$status]);
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

            return [
                'id' => $row->id,
                'title' => $row->title,
                'description' => $row->description,
                'requested_by' => $row->requested_by,
                'requested_by_name' => $requesterName,
                'assigned_to' => $row->assigned_to,
                'assigned_to_name' => $assigneeName,
                'status' => $row->status,
                'priority' => $row->priority,
                'due_at' => $row->due_at,
                'created_at' => $row->created_at,
                'updated_at' => $row->updated_at,
            ];
        })->values();

        return response()->json(['items' => $items]);
    }

    public function creativeSubmissions(Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('creative_submissions')) {
            return response()->json(['items' => []]);
        }

        $limit = max(1, min((int) $request->query('limit', 25), 200));
        $status = strtolower(trim((string) $request->query('status', '')));

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
                'status' => $row->status,
                'created_at' => $row->created_at,
                'updated_at' => $row->updated_at,
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
            'status' => ['nullable', 'string', 'max:40'],
            'priority' => ['nullable', 'string', 'max:20'],
            'dueAt' => ['nullable', 'date'],
        ]);

        $id = DB::table('creative_requests')->insertGetId([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'requested_by' => $validated['requestedBy'] ?? null,
            'assigned_to' => $validated['assignedTo'] ?? null,
            'status' => $validated['status'] ?? 'open',
            'priority' => $validated['priority'] ?? 'medium',
            'due_at' => $validated['dueAt'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Request created.', 'id' => $id], 201);
    }

    public function updateCreativeRequest(int $id, Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('creative_requests')) {
            return response()->json(['message' => 'creative_requests table is missing.'], 500);
        }

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:190'],
            'description' => ['nullable', 'string'],
            'requestedBy' => ['nullable', 'integer'],
            'assignedTo' => ['nullable', 'integer'],
            'status' => ['nullable', 'string', 'max:40'],
            'priority' => ['nullable', 'string', 'max:20'],
            'dueAt' => ['nullable', 'date'],
        ]);

        $payload = [];
        $fieldMap = [
            'title' => 'title',
            'description' => 'description',
            'requestedBy' => 'requested_by',
            'assignedTo' => 'assigned_to',
            'status' => 'status',
            'priority' => 'priority',
            'dueAt' => 'due_at',
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

        $updated = DB::table('creative_requests')->where('id', $id)->update($payload);
        if (!$updated) {
            return response()->json(['message' => 'Request not found.'], 404);
        }

        return response()->json(['message' => 'Request updated.']);
    }

    public function storeCreativeSubmission(Request $request)
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
            'title' => ['required', 'string', 'max:190'],
            'submittedBy' => ['nullable', 'integer'],
            'submissionUrl' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'max:40'],
        ]);

        $id = DB::table('creative_submissions')->insertGetId([
            'request_id' => $validated['requestId'] ?? null,
            'title' => $validated['title'],
            'submitted_by' => $validated['submittedBy'] ?? null,
            'submission_url' => $validated['submissionUrl'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => $validated['status'] ?? 'pending_review',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

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
            'status' => ['nullable', 'string', 'max:40'],
        ]);

        $payload = [];
        $fieldMap = [
            'requestId' => 'request_id',
            'title' => 'title',
            'submittedBy' => 'submitted_by',
            'submissionUrl' => 'submission_url',
            'notes' => 'notes',
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
