<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Support\AuditLog;

class AuditLogController extends Controller
{
    private function ensureAdmin(string $requesterRole)
    {
        if ($requesterRole !== 'admin') {
            return response()->json(['message' => 'Admin access required.'], 403);
        }

        return null;
    }

    public function index(Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->query('requesterRole', '')));
        $adminError = $this->ensureAdmin($requesterRole);
        if ($adminError) {
            return $adminError;
        }

        $limit = max(1, min((int) $request->query('limit', 20), 50));
        $rows = DB::table('audit_logs')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        return response()->json(['items' => $rows]);
    }

    public function flags(Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->query('requesterRole', '')));
        $adminError = $this->ensureAdmin($requesterRole);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('audit_flags')) {
            return response()->json(['items' => [], 'openCount' => 0]);
        }

        $status = strtolower(trim((string) $request->query('status', 'open')));
        $limit = max(1, min((int) $request->query('limit', 20), 100));
        $query = DB::table('audit_flags')->orderByDesc('created_at');

        if (in_array($status, ['open', 'resolved'], true)) {
            $query->whereRaw('LOWER(COALESCE(status, "")) = ?', [$status]);
        }

        $items = $query->limit($limit)->get();
        $openCount = DB::table('audit_flags')
            ->whereRaw('LOWER(COALESCE(status, "")) = ?', ['open'])
            ->count();

        return response()->json([
            'items' => $items,
            'openCount' => $openCount,
        ]);
    }

    public function storeFlag(Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->input('requesterRole', '')));
        $adminError = $this->ensureAdmin($requesterRole);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('audit_flags')) {
            return response()->json(['message' => 'audit_flags table is missing. Run migrations.'], 500);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'details' => ['nullable', 'string', 'max:3000'],
            'severity' => ['required', 'in:low,medium,high,critical'],
            'createdBy' => ['nullable', 'integer'],
        ]);

        $flagId = DB::table('audit_flags')->insertGetId([
            'title' => $validated['title'],
            'details' => $validated['details'] ?? null,
            'severity' => $validated['severity'],
            'status' => 'open',
            'created_by' => $validated['createdBy'] ?? null,
            'resolved_by' => null,
            'resolved_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        AuditLog::write(
            'audit_flag.opened',
            'audit_flag',
            (int) $flagId,
            isset($validated['createdBy']) ? (int) $validated['createdBy'] : null,
            null,
            $requesterRole,
            [],
            [
                'title' => $validated['title'],
                'severity' => $validated['severity'],
            ],
            $request
        );

        return response()->json([
            'message' => 'Audit flag created.',
            'id' => $flagId,
        ], 201);
    }

    public function resolveFlag(int $id, Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->input('requesterRole', '')));
        $adminError = $this->ensureAdmin($requesterRole);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('audit_flags')) {
            return response()->json(['message' => 'audit_flags table is missing. Run migrations.'], 500);
        }

        $validated = $request->validate([
            'resolvedBy' => ['nullable', 'integer'],
        ]);

        $flag = DB::table('audit_flags')->where('id', $id)->first();
        if (!$flag) {
            return response()->json(['message' => 'Audit flag not found.'], 404);
        }

        if (strtolower((string) $flag->status) === 'resolved') {
            return response()->json(['message' => 'Audit flag already resolved.']);
        }

        DB::table('audit_flags')
            ->where('id', $id)
            ->update([
                'status' => 'resolved',
                'resolved_by' => $validated['resolvedBy'] ?? null,
                'resolved_at' => now(),
                'updated_at' => now(),
            ]);

        AuditLog::write(
            'audit_flag.resolved',
            'audit_flag',
            $id,
            isset($validated['resolvedBy']) ? (int) $validated['resolvedBy'] : null,
            null,
            $requesterRole,
            [
                'status' => $flag->status,
            ],
            [
                'status' => 'resolved',
            ],
            $request
        );

        return response()->json(['message' => 'Audit flag resolved.']);
    }
}
