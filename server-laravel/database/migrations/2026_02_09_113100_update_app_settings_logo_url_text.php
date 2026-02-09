<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE app_settings MODIFY logo_url TEXT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE app_settings MODIFY logo_url VARCHAR(255) NULL');
    }
};
