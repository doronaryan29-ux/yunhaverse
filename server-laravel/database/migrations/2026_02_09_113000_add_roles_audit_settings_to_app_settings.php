<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('app_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('app_settings', 'roles')) {
                $table->json('roles')->nullable()->after('primary_color');
            }
            if (!Schema::hasColumn('app_settings', 'audit_settings')) {
                $table->json('audit_settings')->nullable()->after('roles');
            }
        });
    }

    public function down(): void
    {
        Schema::table('app_settings', function (Blueprint $table) {
            if (Schema::hasColumn('app_settings', 'audit_settings')) {
                $table->dropColumn('audit_settings');
            }
            if (Schema::hasColumn('app_settings', 'roles')) {
                $table->dropColumn('roles');
            }
        });
    }
};
