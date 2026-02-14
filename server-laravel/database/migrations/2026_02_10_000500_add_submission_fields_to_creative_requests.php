<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('creative_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('creative_requests', 'submission_title')) {
                $table->string('submission_title', 190)->nullable()->after('description');
            }
            if (!Schema::hasColumn('creative_requests', 'submission_url')) {
                $table->string('submission_url', 255)->nullable()->after('submission_title');
            }
            if (!Schema::hasColumn('creative_requests', 'submission_notes')) {
                $table->text('submission_notes')->nullable()->after('submission_url');
            }
            if (!Schema::hasColumn('creative_requests', 'submitted_by')) {
                $table->unsignedBigInteger('submitted_by')->nullable()->after('submission_notes');
                $table->index('submitted_by');
                $table->foreign('submitted_by')->references('id')->on('users')->onDelete('set null');
            }
            if (!Schema::hasColumn('creative_requests', 'submitted_at')) {
                $table->dateTime('submitted_at')->nullable()->after('submitted_by');
            }
            if (!Schema::hasColumn('creative_requests', 'review_note')) {
                $table->text('review_note')->nullable()->after('submitted_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('creative_requests', function (Blueprint $table) {
            if (Schema::hasColumn('creative_requests', 'review_note')) {
                $table->dropColumn('review_note');
            }
            if (Schema::hasColumn('creative_requests', 'submitted_at')) {
                $table->dropColumn('submitted_at');
            }
            if (Schema::hasColumn('creative_requests', 'submitted_by')) {
                $table->dropForeign(['submitted_by']);
                $table->dropIndex(['submitted_by']);
                $table->dropColumn('submitted_by');
            }
            if (Schema::hasColumn('creative_requests', 'submission_notes')) {
                $table->dropColumn('submission_notes');
            }
            if (Schema::hasColumn('creative_requests', 'submission_url')) {
                $table->dropColumn('submission_url');
            }
            if (Schema::hasColumn('creative_requests', 'submission_title')) {
                $table->dropColumn('submission_title');
            }
        });
    }
};
