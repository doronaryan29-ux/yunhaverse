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
            DB::statement('ALTER TABLE users ALTER COLUMN name DROP NOT NULL');
            DB::statement('ALTER TABLE users ALTER COLUMN password DROP NOT NULL');
            return;
        }

        DB::statement('ALTER TABLE users MODIFY name varchar(255) NULL');
        DB::statement('ALTER TABLE users MODIFY password varchar(255) NULL');
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("UPDATE users SET name = '' WHERE name IS NULL");
            DB::statement("UPDATE users SET password = '' WHERE password IS NULL");
            DB::statement('ALTER TABLE users ALTER COLUMN name SET NOT NULL');
            DB::statement('ALTER TABLE users ALTER COLUMN password SET NOT NULL');
            return;
        }

        DB::statement('ALTER TABLE users MODIFY name varchar(255) NOT NULL');
        DB::statement('ALTER TABLE users MODIFY password varchar(255) NOT NULL');
    }
};
