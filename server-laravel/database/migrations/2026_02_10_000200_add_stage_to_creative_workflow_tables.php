<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('creative_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('creative_requests', 'stage')) {
                $table->string('stage', 40)->default('creative')->index()->after('assigned_to');
            }
        });

        Schema::table('creative_submissions', function (Blueprint $table) {
            if (!Schema::hasColumn('creative_submissions', 'stage')) {
                $table->string('stage', 40)->default('creative')->index()->after('submitted_by');
            }
        });
    }

    public function down(): void
    {
        Schema::table('creative_requests', function (Blueprint $table) {
            if (Schema::hasColumn('creative_requests', 'stage')) {
                $table->dropColumn('stage');
            }
        });

        Schema::table('creative_submissions', function (Blueprint $table) {
            if (Schema::hasColumn('creative_submissions', 'stage')) {
                $table->dropColumn('stage');
            }
        });
    }
};
