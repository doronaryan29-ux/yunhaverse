<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@yuhaverse.local');
        $password = env('ADMIN_PASSWORD', 'Admin123!');
        $firstName = env('ADMIN_FIRST_NAME', 'Admin');
        $lastName = env('ADMIN_LAST_NAME', 'User');

        $existing = DB::table('users')->where('email', $email)->first();
        if ($existing) {
            return;
        }

        DB::table('users')->insert([
            'email' => $email,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'role' => 'admin',
            'status' => 'active',
            'password_hash' => Hash::make($password),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
