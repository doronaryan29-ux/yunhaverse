<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'first_name')) {
                $table->string('first_name', 100)->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'last_name')) {
                $table->string('last_name', 100)->nullable()->after('first_name');
            }
            if (!Schema::hasColumn('users', 'birthdate')) {
                $table->date('birthdate')->nullable()->after('last_name');
            }
            if (!Schema::hasColumn('users', 'password_hash')) {
                $table->string('password_hash', 255)->nullable()->after('password');
            }
            if (!Schema::hasColumn('users', 'otp_code')) {
                $table->string('otp_code', 256)->nullable()->after('remember_token');
            }
            if (!Schema::hasColumn('users', 'otp_expires_at')) {
                $table->dateTime('otp_expires_at')->nullable()->after('otp_code');
            }
            if (!Schema::hasColumn('users', 'otp_attempts')) {
                $table->unsignedTinyInteger('otp_attempts')->default(0)->after('otp_expires_at');
            }
            if (!Schema::hasColumn('users', 'google_id')) {
                $table->string('google_id', 255)->nullable()->after('otp_attempts');
            }
            if (!Schema::hasColumn('users', 'full_name')) {
                $table->string('full_name', 255)->nullable()->after('google_id');
            }
            if (!Schema::hasColumn('users', 'avatar_url')) {
                $table->string('avatar_url', 512)->nullable()->after('full_name');
            }
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['member', 'admin', 'creative'])->default('member')->after('avatar_url');
            }
            if (!Schema::hasColumn('users', 'status')) {
                $table->enum('status', ['active', 'suspended', 'pending'])->default('pending')->after('role');
            }
            if (!Schema::hasColumn('users', 'last_login_at')) {
                $table->dateTime('last_login_at')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = [
                'first_name',
                'last_name',
                'birthdate',
                'password_hash',
                'otp_code',
                'otp_expires_at',
                'otp_attempts',
                'google_id',
                'full_name',
                'avatar_url',
                'role',
                'status',
                'last_login_at',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
