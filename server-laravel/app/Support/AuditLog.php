<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuditLog
{
    public static function write(
        string $action,
        string $entityType,
        ?int $entityId,
        ?int $actorUserId,
        ?string $actorEmail,
        ?string $actorRole,
        array $before = [],
        array $after = [],
        ?Request $request = null
    ): void {
        DB::table('audit_logs')->insert([
            'actor_user_id' => $actorUserId,
            'actor_email' => $actorEmail,
            'actor_role' => $actorRole,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'before_data' => $before ? json_encode($before) : null,
            'after_data' => $after ? json_encode($after) : null,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
