<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    private function generateOtp(int $length = 6): string
    {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $otp = '';
        for ($i = 0; $i < $length; $i += 1) {
            $otp .= $chars[random_int(0, strlen($chars) - 1)];
        }
        return $otp;
    }

    private function hashOtp(string $otp): string
    {
        return hash('sha256', $otp);
    }

    public function sendOtp(Request $request)
    {
        $email = strtolower(trim((string) $request->input('email', '')));
        $mode = (string) $request->input('mode', 'login');
        $password = (string) $request->input('password', '');
        $firstName = trim((string) $request->input('firstName', ''));
        $lastName = trim((string) $request->input('lastName', ''));
        $birthdate = $request->input('birthdate');

        if (!$email) {
            return response()->json(['message' => 'Email is required.'], 400);
        }

        $otpTtlMinutes = (int) env('OTP_TTL_MINUTES', 10);
        $otpCooldownSeconds = (int) env('OTP_COOLDOWN_SECONDS', 60);

        $existing = DB::table('users')->where('email', $email)->first();

        if ($existing && $existing->status === 'suspended') {
            return response()->json(['message' => 'Account not active.'], 403);
        }

        if ($mode === 'login' && !$existing) {
            return response()->json(['message' => 'Account not found. Please sign up.'], 404);
        }

        if ($mode === 'signup') {
            if ($existing && $existing->email_verified_at) {
                return response()->json(['message' => 'Account already exists.'], 409);
            }
            if ($password && (strlen($password) < 8 || !preg_match('/[A-Z]/', $password))) {
                return response()->json([
                    'message' => 'Password must be at least 8 characters and include 1 uppercase letter.',
                ], 400);
            }
        }

        if ($existing && $existing->otp_expires_at) {
            $remaining = strtotime($existing->otp_expires_at) - time();
            if ($remaining > $otpCooldownSeconds) {
                return response()->json(['message' => 'OTP already sent. Please wait.'], 429);
            }
        }

        $otp = $this->generateOtp();
        $otpHash = $this->hashOtp($otp);
        $expiresAt = now()->addMinutes($otpTtlMinutes);
        $passwordHash = $mode === 'signup' && $password ? Hash::make($password) : null;

        if ($existing) {
            $nextStatus = ($mode === 'signup' && !$existing->email_verified_at) ? 'pending' : $existing->status;
            DB::table('users')->where('id', $existing->id)->update([
                'otp_code' => $otpHash,
                'otp_expires_at' => $expiresAt,
                'otp_attempts' => 0,
                'first_name' => $firstName ?: $existing->first_name,
                'last_name' => $lastName ?: $existing->last_name,
                'birthdate' => $birthdate ?: $existing->birthdate,
                'password_hash' => $passwordHash ?: $existing->password_hash,
                'status' => $nextStatus,
                'updated_at' => now(),
            ]);
        } else {
            DB::table('users')->insert([
                'email' => $email,
                'first_name' => $firstName ?: null,
                'last_name' => $lastName ?: null,
                'birthdate' => $birthdate ?: null,
                'password_hash' => $passwordHash,
                'otp_code' => $otpHash,
                'otp_expires_at' => $expiresAt,
                'otp_attempts' => 0,
                'role' => 'member',
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        Mail::raw(
            "Your verification code is {$otp}. It expires in {$otpTtlMinutes} minutes.",
            function ($message) use ($email) {
                $message->to($email)->subject('Your YUNHAverse verification code');
            }
        );

        return response()->json(['message' => 'OTP sent.']);
    }

    public function login(Request $request)
    {
        $email = strtolower(trim((string) $request->input('email', '')));
        $password = (string) $request->input('password', '');

        if (!$email || !$password) {
            return response()->json(['message' => 'Email and password are required.'], 400);
        }

        $user = DB::table('users')->where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'Account not found.'], 404);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'Account not active.'], 403);
        }

        if (!$user->password_hash || !Hash::check($password, $user->password_hash)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        DB::table('users')->where('id', $user->id)->update([
            'last_login_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Logged in.',
            'user' => [
                'id' => $user->id,
                'email' => $email,
                'role' => $user->role,
            ],
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $email = strtolower(trim((string) $request->input('email', '')));
        $otp = strtoupper(trim((string) $request->input('otp', '')));

        if (!$email || !$otp) {
            return response()->json(['message' => 'Email and OTP are required.'], 400);
        }

        $otpMaxAttempts = (int) env('OTP_MAX_ATTEMPTS', 5);
        $user = DB::table('users')->where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->status === 'suspended') {
            return response()->json(['message' => 'Account not active.'], 403);
        }

        if ($user->otp_attempts >= $otpMaxAttempts) {
            return response()->json(['message' => 'Too many attempts. Try later.'], 429);
        }

        if (!$user->otp_expires_at || now()->greaterThan($user->otp_expires_at)) {
            return response()->json(['message' => 'OTP expired. Request a new one.'], 400);
        }

        if ($this->hashOtp($otp) !== $user->otp_code) {
            DB::table('users')->where('id', $user->id)->update([
                'otp_attempts' => $user->otp_attempts + 1,
                'updated_at' => now(),
            ]);
            return response()->json(['message' => 'Invalid OTP.'], 401);
        }

        DB::table('users')->where('id', $user->id)->update([
            'otp_code' => null,
            'otp_expires_at' => null,
            'otp_attempts' => 0,
            'email_verified_at' => $user->email_verified_at ?: now(),
            'last_login_at' => now(),
            'status' => 'active',
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Verified.',
            'user' => [
                'id' => $user->id,
                'email' => $email,
                'role' => $user->role,
            ],
        ]);
    }

    public function cancelSignup(Request $request)
    {
        $email = strtolower(trim((string) $request->input('email', '')));
        if (!$email) {
            return response()->json(['message' => 'Email is required.'], 400);
        }

        DB::table('users')
            ->where('email', $email)
            ->whereNull('email_verified_at')
            ->delete();

        return response()->json(['message' => 'Signup cancelled.']);
    }
}
