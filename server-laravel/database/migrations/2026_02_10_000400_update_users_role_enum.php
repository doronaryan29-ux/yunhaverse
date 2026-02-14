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

        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(255)');
            DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'member'");
            DB::statement("UPDATE users SET role = 'member' WHERE role IS NULL OR role NOT IN ('member','admin','creative','copywriter','sns_updater')");
            DB::unprepared(<<<'SQL'
DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT pc.conname
    FROM pg_constraint pc
    JOIN pg_class t ON t.oid = pc.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE t.relname = 'users'
      AND n.nspname = current_schema()
      AND pc.contype = 'c'
      AND pg_get_constraintdef(pc.oid) ILIKE '%role%'
  LOOP
    EXECUTE format('ALTER TABLE users DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;
SQL);
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('member','admin','creative','copywriter','sns_updater'))");
            DB::statement('ALTER TABLE users ALTER COLUMN role SET NOT NULL');
            return;
        }

        DB::statement("ALTER TABLE users MODIFY role ENUM('member','admin','creative','copywriter','sns_updater') NOT NULL DEFAULT 'member'");
    }

    public function down(): void
    {
        if (!Schema::hasColumn('users', 'role')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(255)');
            DB::statement("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'member'");
            DB::statement("UPDATE users SET role = 'member' WHERE role IS NULL OR role NOT IN ('member','admin','creative')");
            DB::unprepared(<<<'SQL'
DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT pc.conname
    FROM pg_constraint pc
    JOIN pg_class t ON t.oid = pc.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE t.relname = 'users'
      AND n.nspname = current_schema()
      AND pc.contype = 'c'
      AND pg_get_constraintdef(pc.oid) ILIKE '%role%'
  LOOP
    EXECUTE format('ALTER TABLE users DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;
SQL);
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('member','admin','creative'))");
            DB::statement('ALTER TABLE users ALTER COLUMN role SET NOT NULL');
            return;
        }

        DB::statement("ALTER TABLE users MODIFY role ENUM('member','admin','creative') NOT NULL DEFAULT 'member'");
    }
};
