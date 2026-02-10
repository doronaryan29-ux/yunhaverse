<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'role')) {
            return;
        }

        DB::statement(
            "ALTER TABLE users MODIFY role ENUM('member','admin','creative','copywriter','sns_updater') NOT NULL DEFAULT 'member'"
        );
    }

    public function down(): void
    {
        if (!Schema::hasColumn('users', 'role')) {
            return;
        }

        DB::statement(
            "ALTER TABLE users MODIFY role ENUM('member','admin','creative') NOT NULL DEFAULT 'member'"
        );
    }
};
