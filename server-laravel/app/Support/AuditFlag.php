<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AuditFlag
{
    public static function open(
        string $title,
        ?string $details = null,
        string $severity = 'medium',
        ?int $createdBy = null,
        int $dedupeHours = 12
    ): ?int {
        if (!Schema::hasTable('audit_flags')) {
            return null;
        }

        $existing = DB::table('audit_flags')
            ->whereRaw('LOWER(COALESCE(status, "")) = ?', ['open'])
            ->where('title', $title)
            ->when($createdBy !== null, function ($query) use ($createdBy) {
                $query->where('created_by', $createdBy);
            })
            ->where('created_at', '>=', now()->subHours(max(1, $dedupeHours)))
            ->exists();

        if ($existing) {
            return null;
        }

        return DB::table('audit_flags')->insertGetId([
            'title' => $title,
            'details' => $details,
            'severity' => $severity,
            'status' => 'open',
            'created_by' => $createdBy,
            'resolved_by' => null,
            'resolved_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
