<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdminDataController extends Controller
{
    private function ensureAdmin(Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->query('requesterRole', '')));
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
            ->select(['id', 'email', 'first_name', 'last_name', 'full_name', 'role', 'status', 'created_at'])
            ->whereRaw('LOWER(COALESCE(role, "")) IN (?, ?)', ['member', 'creative'])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

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
                'role' => ucfirst(strtolower((string) ($row->role ?? 'member'))),
                'status' => ucfirst(strtolower((string) ($row->status ?? 'pending'))),
                'joinedAt' => $row->created_at,
            ];
        })->values();

        return response()->json(['items' => $items]);
    }
}
