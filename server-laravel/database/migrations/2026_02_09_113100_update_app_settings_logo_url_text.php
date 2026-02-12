<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE app_settings ALTER COLUMN logo_url TYPE TEXT');
            DB::statement('ALTER TABLE app_settings ALTER COLUMN logo_url DROP NOT NULL');
            return;
        }

        DB::statement('ALTER TABLE app_settings MODIFY logo_url TEXT NULL');
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE app_settings ALTER COLUMN logo_url TYPE VARCHAR(255)');
            DB::statement('ALTER TABLE app_settings ALTER COLUMN logo_url DROP NOT NULL');
            return;
        }

        DB::statement('ALTER TABLE app_settings MODIFY logo_url VARCHAR(255) NULL');
    }
};
