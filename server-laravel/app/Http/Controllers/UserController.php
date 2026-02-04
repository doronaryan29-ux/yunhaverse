<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Support\AuditLog;
use App\Support\AuditFlag;

class UserController extends Controller
{
    public function profile(int $id, Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->query('requesterRole', '')));
        $requesterId = (int) $request->query('requesterId', 0);

        if ($requesterRole !== 'admin' || $requesterId !== $id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $user = DB::table('users')->where('id', $id)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'birthdate' => $user->birthdate,
            'role' => $user->role,
            'status' => $user->status,
        ]);
    }

    public function updateProfile(int $id, Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->input('requesterRole', '')));
        $requesterId = (int) $request->input('requesterId', 0);

        if ($requesterRole !== 'admin' || $requesterId !== $id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $user = DB::table('users')->where('id', $id)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $incomingRole = $request->input('role');
        $incomingStatus = $request->input('status');
        $roleAttempted = $incomingRole !== null && strtolower(trim((string) $incomingRole)) !== strtolower((string) $user->role);
        $statusAttempted = $incomingStatus !== null && strtolower(trim((string) $incomingStatus)) !== strtolower((string) $user->status);

        if ($roleAttempted || $statusAttempted) {
            $parts = [];
            if ($roleAttempted) {
                $parts[] = 'role=' . strtolower(trim((string) $incomingRole));
            }
            if ($statusAttempted) {
                $parts[] = 'status=' . strtolower(trim((string) $incomingStatus));
            }
            $details = 'User ' . $user->email . ' profile update attempted privileged fields: ' . implode(', ', $parts);
            $flagId = AuditFlag::open(
                'Suspicious role/status change attempt',
                $details,
                'critical',
                $requesterId
            );
            if ($flagId) {
                AuditLog::write(
                    'audit_flag.opened',
                    'audit_flag',
                    (int) $flagId,
                    $requesterId,
                    $user->email,
                    $requesterRole,
                    [],
                    ['trigger' => 'suspicious_role_status_change', 'details' => $details],
                    $request
                );
            }
        }

        $validated = $request->validate([
            'firstName' => ['required', 'string', 'max:120'],
            'lastName' => ['required', 'string', 'max:120'],
            'birthdate' => ['nullable', 'date'],
        ]);

        $updated = DB::table('users')
            ->where('id', $id)
            ->update([
                'first_name' => $validated['firstName'],
                'last_name' => $validated['lastName'],
                'birthdate' => $validated['birthdate'] ?? null,
                'updated_at' => now(),
            ]);

        if ($updated === 0) {
            return response()->json(['message' => 'No changes made.']);
        }

        AuditLog::write(
            'user.profile_updated',
            'user',
            $id,
            $requesterId,
            $user->email,
            $requesterRole,
            [
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'birthdate' => $user->birthdate,
            ],
            [
                'firstName' => $validated['firstName'],
                'lastName' => $validated['lastName'],
                'birthdate' => $validated['birthdate'] ?? null,
            ],
            $request
        );

        $profileFlagDetails = 'Admin profile fields changed for user ' . $user->email . ' by admin user #' . $requesterId . '.';
        $flagId = AuditFlag::open(
            'Profile changed by admin',
            $profileFlagDetails,
            'medium',
            $requesterId,
            2
        );
        if ($flagId) {
            AuditLog::write(
                'audit_flag.opened',
                'audit_flag',
                (int) $flagId,
                $requesterId,
                $user->email,
                $requesterRole,
                [],
                ['trigger' => 'profile_change_by_admin', 'targetUserId' => $id],
                $request
            );
        }

        return response()->json(['message' => 'Profile updated.']);
    }
}
