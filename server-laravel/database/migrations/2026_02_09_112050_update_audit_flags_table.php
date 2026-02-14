<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audit_flags', function (Blueprint $table) {
            if (!Schema::hasColumn('audit_flags', 'audit_log_id')) {
                $table->unsignedBigInteger('audit_log_id')->nullable()->after('id');
            }
            if (!Schema::hasColumn('audit_flags', 'flagged_by_user_id')) {
                $table->unsignedBigInteger('flagged_by_user_id')->nullable()->after('audit_log_id');
            }
            if (!Schema::hasColumn('audit_flags', 'flagged_by_email')) {
                $table->string('flagged_by_email')->nullable()->after('flagged_by_user_id');
            }
            if (!Schema::hasColumn('audit_flags', 'reason')) {
                $table->string('reason')->nullable()->after('flagged_by_email');
            }
            if (!Schema::hasColumn('audit_flags', 'notes')) {
                $table->text('notes')->nullable()->after('status');
            }

            if (!Schema::hasColumn('audit_flags', 'audit_log_id')) {
                $table->index('audit_log_id', 'idx_audit_flags_audit_log');
            }
            if (!Schema::hasColumn('audit_flags', 'flagged_by_user_id')) {
                $table->index('flagged_by_user_id', 'idx_audit_flags_flagged_by');
            }
        });

        if (Schema::hasTable('audit_logs') && Schema::hasColumn('audit_flags', 'audit_log_id')) {
            Schema::table('audit_flags', function (Blueprint $table) {
                $table->foreign('audit_log_id', 'fk_audit_flags_audit_log')
                    ->references('id')
                    ->on('audit_logs')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::table('audit_flags', function (Blueprint $table) {
            if (Schema::hasColumn('audit_flags', 'audit_log_id')) {
                $table->dropForeign('fk_audit_flags_audit_log');
                $table->dropIndex('idx_audit_flags_audit_log');
                $table->dropColumn('audit_log_id');
            }
            if (Schema::hasColumn('audit_flags', 'flagged_by_user_id')) {
                $table->dropIndex('idx_audit_flags_flagged_by');
                $table->dropColumn('flagged_by_user_id');
            }
            if (Schema::hasColumn('audit_flags', 'flagged_by_email')) {
                $table->dropColumn('flagged_by_email');
            }
            if (Schema::hasColumn('audit_flags', 'reason')) {
                $table->dropColumn('reason');
            }
            if (Schema::hasColumn('audit_flags', 'notes')) {
                $table->dropColumn('notes');
            }
        });
    }
};
