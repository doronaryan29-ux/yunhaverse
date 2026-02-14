<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DashboardBootstrapSeeder extends Seeder
{
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'admin@yuhaverse.local');
        $admin = DB::table('users')->where('email', $adminEmail)->first()
            ?: DB::table('users')->where('role', 'admin')->orderBy('id')->first();
        $adminId = $admin->id ?? null;

        $creativeId = null;
        $memberId = null;

        if (Schema::hasTable('users')) {
            $creative = DB::table('users')->where('role', 'creative')->orderBy('id')->first();
            if (!$creative) {
                $creativeId = DB::table('users')->insertGetId([
                    'email' => 'creative@yunhaverse.app',
                    'name' => 'Creative Staff',
                    'first_name' => 'Creative',
                    'last_name' => 'Staff',
                    'full_name' => 'Creative Staff',
                    'password' => '',
                    'role' => 'creative',
                    'status' => 'active',
                    'password_hash' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $creativeId = $creative->id;
            }

            $member = DB::table('users')->where('role', 'member')->orderBy('id')->first();
            if (!$member) {
                $memberId = DB::table('users')->insertGetId([
                    'email' => 'member@yunhaverse.app',
                    'name' => 'Sample Member',
                    'first_name' => 'Sample',
                    'last_name' => 'Member',
                    'full_name' => 'Sample Member',
                    'password' => '',
                    'role' => 'member',
                    'status' => 'active',
                    'password_hash' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $memberId = $member->id;
            }
        }

        if (Schema::hasTable('app_settings') && DB::table('app_settings')->count() === 0) {
            $payload = [
                'app_name' => 'YUNHAverse',
                'logo_url' => null,
                'homepage_headline' => 'Welcome to YunhaVerse',
                'homepage_subheadline' => 'A place for creators to thrive.',
                'primary_color' => '#f43f5e',
                'updated_by' => $adminId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            if (Schema::hasColumn('app_settings', 'roles')) {
                $payload['roles'] = json_encode(['admin', 'member', 'creative', 'copywriter', 'sns_updater']);
            }
            if (Schema::hasColumn('app_settings', 'audit_settings')) {
                $payload['audit_settings'] = json_encode(['flagSensitiveContent' => true]);
            }
            DB::table('app_settings')->insert($payload);
        }

        if (Schema::hasTable('events') && DB::table('events')->count() === 0) {
            DB::table('events')->insert([
                [
                    'title' => 'YUNHA Birthday Cupsleeve',
                    'description' => 'Fan-organized meetup for birthday celebration.',
                    'start_at' => now()->addDays(10),
                    'end_at' => now()->addDays(10)->addHours(3),
                    'location' => 'Seoul Cafe District',
                    'timezone' => 'Asia/Manila',
                    'type' => 'cupsleeve',
                    'status' => 'published',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'title' => 'Weekly Streaming Party',
                    'description' => 'Community stream and live chat.',
                    'start_at' => now()->addDays(4),
                    'end_at' => now()->addDays(4)->addHours(2),
                    'location' => 'Discord Live',
                    'timezone' => 'Asia/Manila',
                    'type' => 'streaming',
                    'status' => 'published',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }

        if (Schema::hasTable('notifications') && DB::table('notifications')->count() === 0) {
            $payload = [
                'type' => 'announcement',
                'title' => 'Welcome to YUNHAverse',
                'message' => 'Initial dashboard setup is complete.',
                'audience' => 'all',
                'priority' => 'normal',
                'status' => 'published',
                'publish_at' => now(),
                'expires_at' => null,
                'created_by' => $adminId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            if (Schema::hasColumn('notifications', 'user_id')) {
                $payload['user_id'] = null;
            }
            DB::table('notifications')->insert($payload);
        }

        if (Schema::hasTable('audit_flags') && DB::table('audit_flags')->count() === 0) {
            $payload = [
                'title' => 'Review signup workflow',
                'details' => 'Initial audit flag generated for dashboard bootstrap.',
                'severity' => 'low',
                'status' => 'open',
                'created_at' => now(),
                'updated_at' => now(),
            ];
            if (Schema::hasColumn('audit_flags', 'flagged_by_user_id')) {
                $payload['flagged_by_user_id'] = $adminId;
            } elseif (Schema::hasColumn('audit_flags', 'created_by')) {
                $payload['created_by'] = $adminId;
            }
            if (Schema::hasColumn('audit_flags', 'flagged_by_email')) {
                $payload['flagged_by_email'] = $adminEmail;
            }
            if (Schema::hasColumn('audit_flags', 'reason')) {
                $payload['reason'] = 'bootstrap';
            }
            DB::table('audit_flags')->insert($payload);
        }

        if (Schema::hasTable('creative_requests') && DB::table('creative_requests')->count() === 0) {
            $payload = [
                'title' => 'Teaser Poster Draft',
                'description' => 'Create social teaser visual for next campaign.',
                'requested_by' => $adminId ?: $memberId,
                'assigned_to' => $creativeId,
                'status' => 'in_progress',
                'priority' => 'high',
                'due_at' => now()->addDays(7),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            if (Schema::hasColumn('creative_requests', 'stage')) {
                $payload['stage'] = 'creative';
            }
            $requestId = DB::table('creative_requests')->insertGetId($payload);

            if (Schema::hasTable('creative_submissions') && DB::table('creative_submissions')->count() === 0) {
                $payload = [
                    'request_id' => $requestId,
                    'title' => 'Teaser Poster v1',
                    'submitted_by' => $creativeId,
                    'submission_url' => 'https://example.com/mock-teaser-v1',
                    'notes' => 'Initial draft for review.',
                    'status' => 'pending_review',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                if (Schema::hasColumn('creative_submissions', 'stage')) {
                    $payload['stage'] = 'creative';
                }
                DB::table('creative_submissions')->insert($payload);
            }
        }

        if (Schema::hasTable('donations') && DB::table('donations')->count() === 0) {
            DB::table('donations')->insert([
                'user_id' => $memberId,
                'name' => 'Sample Member',
                'email' => 'member@yunhaverse.app',
                'amount' => 500.00,
                'currency' => 'PHP',
                'channel' => 'gcash',
                'status' => 'completed',
                'notes' => 'Bootstrap donation record.',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
