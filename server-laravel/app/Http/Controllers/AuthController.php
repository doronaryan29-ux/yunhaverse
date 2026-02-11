<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use App\Support\AuditLog;
use App\Support\AuditFlag;

class AuthController extends Controller
{
    private function registerFailedLoginAttempt(
        ?string $email,
        ?int $userId,
        Request $request,
        string $reason
    ): void {
        $normalizedEmail = strtolower(trim((string) $email));
        if (!$normalizedEmail) {
            return;
        }

        $threshold = max(1, (int) env('LOGIN_FAILED_FLAG_THRESHOLD', 5));
        $windowMinutes = max(1, (int) env('LOGIN_FAILED_FLAG_WINDOW_MINUTES', 15));
        $key = 'auth:failed-login:' . $normalizedEmail;
        $count = (int) Cache::increment($key);
        Cache::put($key, $count, now()->addMinutes($windowMinutes));

        if ($count >= $threshold) {
            $flagId = AuditFlag::open(
                'Failed login attempts threshold reached',
                "Email {$normalizedEmail} reached {$count} failed login attempts in {$windowMinutes} minutes. Latest reason: {$reason}.",
                'high',
                $userId
            );

            if ($flagId) {
                AuditLog::write(
                    'audit_flag.opened',
                    'audit_flag',
                    (int) $flagId,
                    $userId,
                    $normalizedEmail,
                    null,
                    [],
                    [
                        'trigger' => 'failed_login_threshold',
                        'attempts' => $count,
                        'windowMinutes' => $windowMinutes,
                    ],
                    $request
                );
            }
        }
    }

    private function maybeFlagOtpLockout(
        object $user,
        int $attempts,
        int $maxAttempts,
        Request $request
    ): void {
        if ($attempts < $maxAttempts) {
            return;
        }

        $flagId = AuditFlag::open(
            'OTP attempts limit reached',
            "User {$user->email} reached {$attempts}/{$maxAttempts} failed OTP attempts.",
            'high',
            (int) $user->id
        );

        if ($flagId) {
            AuditLog::write(
                'audit_flag.opened',
                'audit_flag',
                (int) $flagId,
                (int) $user->id,
                $user->email,
                $user->role ?? null,
                [],
                [
                    'trigger' => 'otp_max_attempts',
                    'attempts' => $attempts,
                    'maxAttempts' => $maxAttempts,
                ],
                $request
            );
        }
    }

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

    private function generateResetToken(): string
    {
        return bin2hex(random_bytes(24));
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
            $this->registerFailedLoginAttempt($email ?: null, null, $request, 'missing_credentials');
            AuditLog::write(
                'auth.login_failed',
                'user',
                null,
                null,
                $email ?: null,
                null,
                [],
                ['reason' => 'missing_credentials'],
                $request
            );
            return response()->json(['message' => 'Email and password are required.'], 400);
        }

        $user = DB::table('users')->where('email', $email)->first();
        if (!$user) {
            $this->registerFailedLoginAttempt($email, null, $request, 'account_not_found');
            AuditLog::write(
                'auth.login_failed',
                'user',
                null,
                null,
                $email,
                null,
                [],
                ['reason' => 'account_not_found'],
                $request
            );
            return response()->json(['message' => 'Account not found.'], 404);
        }

        if ($user->status !== 'active') {
            $this->registerFailedLoginAttempt($email, (int) $user->id, $request, 'account_not_active');
            AuditLog::write(
                'auth.login_failed',
                'user',
                (int) $user->id,
                (int) $user->id,
                $email,
                $user->role,
                [],
                ['reason' => 'account_not_active', 'status' => $user->status],
                $request
            );
            return response()->json(['message' => 'Account not active.'], 403);
        }

        if (!$user->password_hash || !Hash::check($password, $user->password_hash)) {
            $this->registerFailedLoginAttempt($email, (int) $user->id, $request, 'invalid_credentials');
            AuditLog::write(
                'auth.login_failed',
                'user',
                (int) $user->id,
                (int) $user->id,
                $email,
                $user->role,
                [],
                ['reason' => 'invalid_credentials'],
                $request
            );
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        DB::table('users')->where('id', $user->id)->update([
            'last_login_at' => now(),
            'updated_at' => now(),
        ]);
        Cache::forget('auth:failed-login:' . $email);

        AuditLog::write(
            'auth.login_success',
            'user',
            (int) $user->id,
            (int) $user->id,
            $email,
            $user->role,
            [],
            ['method' => 'password'],
            $request
        );

        return response()->json([
            'message' => 'Logged in.',
            'user' => [
                'id' => $user->id,
                'email' => $email,
                'role' => $user->role,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
            ],
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $email = strtolower(trim((string) $request->input('email', '')));
        $otp = strtoupper(trim((string) $request->input('otp', '')));

        if (!$email || !$otp) {
            AuditLog::write(
                'auth.otp_verify_failed',
                'user',
                null,
                null,
                $email ?: null,
                null,
                [],
                ['reason' => 'missing_email_or_otp'],
                $request
            );
            return response()->json(['message' => 'Email and OTP are required.'], 400);
        }

        $otpMaxAttempts = (int) env('OTP_MAX_ATTEMPTS', 5);
        $user = DB::table('users')->where('email', $email)->first();

        if (!$user) {
            AuditLog::write(
                'auth.otp_verify_failed',
                'user',
                null,
                null,
                $email,
                null,
                [],
                ['reason' => 'user_not_found'],
                $request
            );
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->status === 'suspended') {
            AuditLog::write(
                'auth.otp_verify_failed',
                'user',
                (int) $user->id,
                (int) $user->id,
                $email,
                $user->role,
                [],
                ['reason' => 'account_suspended'],
                $request
            );
            return response()->json(['message' => 'Account not active.'], 403);
        }

        if ($user->otp_attempts >= $otpMaxAttempts) {
            $this->maybeFlagOtpLockout($user, (int) $user->otp_attempts, $otpMaxAttempts, $request);
            AuditLog::write(
                'auth.otp_verify_failed',
                'user',
                (int) $user->id,
                (int) $user->id,
                $email,
                $user->role,
                [],
                ['reason' => 'max_attempts_reached'],
                $request
            );
            return response()->json(['message' => 'Too many attempts. Try later.'], 429);
        }

        if (!$user->otp_expires_at || now()->greaterThan($user->otp_expires_at)) {
            AuditLog::write(
                'auth.otp_verify_failed',
                'user',
                (int) $user->id,
                (int) $user->id,
                $email,
                $user->role,
                [],
                ['reason' => 'otp_expired'],
                $request
            );
            return response()->json(['message' => 'OTP expired. Request a new one.'], 400);
        }

        if ($this->hashOtp($otp) !== $user->otp_code) {
            $nextAttempts = (int) $user->otp_attempts + 1;
            DB::table('users')->where('id', $user->id)->update([
                'otp_attempts' => $nextAttempts,
                'updated_at' => now(),
            ]);
            $this->maybeFlagOtpLockout($user, $nextAttempts, $otpMaxAttempts, $request);
            AuditLog::write(
                'auth.otp_verify_failed',
                'user',
                (int) $user->id,
                (int) $user->id,
                $email,
                $user->role,
                [],
                ['reason' => 'invalid_otp'],
                $request
            );
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

        AuditLog::write(
            'auth.otp_verify_success',
            'user',
            (int) $user->id,
            (int) $user->id,
            $email,
            $user->role,
            [],
            ['method' => 'otp'],
            $request
        );

        return response()->json([
            'message' => 'Verified.',
            'user' => [
                'id' => $user->id,
                'email' => $email,
                'role' => $user->role,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
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

    public function sendPasswordResetOtp(Request $request)
    {
        $email = strtolower(trim((string) $request->input('email', '')));
        if (!$email) {
            return response()->json(['message' => 'Email is required.'], 400);
        }

        $user = DB::table('users')->where('email', $email)->first();
        if (!$user) {
            AuditLog::write(
                'auth.reset_otp_failed',
                'user',
                null,
                null,
                $email,
                null,
                [],
                ['reason' => 'user_not_found'],
                $request
            );
            return response()->json(['message' => 'Account not found.'], 404);
        }

        if ($user->status === 'suspended') {
            AuditLog::write(
                'auth.reset_otp_failed',
                'user',
                (int) $user->id,
                (int) $user->id,
                $email,
                $user->role,
                [],
                ['reason' => 'account_suspended'],
                $request
            );
            return response()->json(['message' => 'Account not active.'], 403);
        }

        $otpTtlMinutes = (int) env('OTP_TTL_MINUTES', 10);
        $otpCooldownSeconds = (int) env('OTP_COOLDOWN_SECONDS', 60);

        if ($user->otp_expires_at) {
            $remaining = strtotime($user->otp_expires_at) - time();
            if ($remaining > $otpCooldownSeconds) {
                return response()->json(['message' => 'OTP already sent. Please wait.'], 429);
            }
        }

        $otp = $this->generateOtp();
        $otpHash = $this->hashOtp($otp);
        $expiresAt = now()->addMinutes($otpTtlMinutes);

        DB::table('users')->where('id', $user->id)->update([
            'otp_code' => $otpHash,
            'otp_expires_at' => $expiresAt,
            'otp_attempts' => 0,
            'updated_at' => now(),
        ]);

        Mail::raw(
            "Your password reset code is {$otp}. It expires in {$otpTtlMinutes} minutes.",
            function ($message) use ($email) {
                $message->to($email)->subject('Your YUNHAverse password reset code');
            }
        );

        AuditLog::write(
            'auth.reset_otp_sent',
            'user',
            (int) $user->id,
            (int) $user->id,
            $email,
            $user->role,
            [],
            ['method' => 'email'],
            $request
        );

        return response()->json(['message' => 'OTP sent.']);
    }

    public function verifyPasswordResetOtp(Request $request)
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

        if ($user->otp_attempts >= $otpMaxAttempts) {
            $this->maybeFlagOtpLockout($user, (int) $user->otp_attempts, $otpMaxAttempts, $request);
            return response()->json(['message' => 'Too many attempts. Try later.'], 429);
        }

        if (!$user->otp_expires_at || now()->greaterThan($user->otp_expires_at)) {
            return response()->json(['message' => 'OTP expired. Request a new one.'], 400);
        }

        if ($this->hashOtp($otp) !== $user->otp_code) {
            $nextAttempts = (int) $user->otp_attempts + 1;
            DB::table('users')->where('id', $user->id)->update([
                'otp_attempts' => $nextAttempts,
                'updated_at' => now(),
            ]);
            $this->maybeFlagOtpLockout($user, $nextAttempts, $otpMaxAttempts, $request);
            return response()->json(['message' => 'Invalid OTP.'], 401);
        }

        $token = $this->generateResetToken();
        $ttlMinutes = (int) env('RESET_TOKEN_TTL_MINUTES', 15);
        Cache::put('auth:reset-token:' . $email, $token, now()->addMinutes($ttlMinutes));

        AuditLog::write(
            'auth.reset_otp_verified',
            'user',
            (int) $user->id,
            (int) $user->id,
            $email,
            $user->role,
            [],
            ['method' => 'email'],
            $request
        );

        return response()->json(['message' => 'OTP verified.', 'resetToken' => $token]);
    }

    public function resetPassword(Request $request)
    {
        $email = strtolower(trim((string) $request->input('email', '')));
        $resetToken = (string) $request->input('resetToken', '');
        $password = (string) $request->input('password', '');

        if (!$email || !$resetToken || !$password) {
            return response()->json(['message' => 'Email, reset token, and password are required.'], 400);
        }

        if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password)) {
            return response()->json([
                'message' => 'Password must be at least 8 characters and include 1 uppercase letter.',
            ], 400);
        }

        $user = DB::table('users')->where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $cachedToken = Cache::get('auth:reset-token:' . $email);
        if (!$cachedToken || !hash_equals($cachedToken, $resetToken)) {
            return response()->json(['message' => 'Reset token invalid or expired.'], 401);
        }

        DB::table('users')->where('id', $user->id)->update([
            'password_hash' => Hash::make($password),
            'otp_code' => null,
            'otp_expires_at' => null,
            'otp_attempts' => 0,
            'updated_at' => now(),
        ]);
        Cache::forget('auth:reset-token:' . $email);

        AuditLog::write(
            'auth.password_reset',
            'user',
            (int) $user->id,
            (int) $user->id,
            $email,
            $user->role,
            [],
            ['method' => 'email'],
            $request
        );

        return response()->json(['message' => 'Password reset successful.']);
    }

    public function googleRedirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function googleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable $e) {
            Log::error('Google callback failed', [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);
            AuditLog::write(
                'auth.google_login_failed',
                'user',
                null,
                null,
                null,
                null,
                [],
                ['reason' => 'socialite_callback_error', 'code' => $e->getCode()],
                $request
            );
            return response('Google sign-in failed.', 401);
        }

        $email = strtolower(trim((string) $googleUser->getEmail()));
        if (!$email) {
            AuditLog::write(
                'auth.google_login_failed',
                'user',
                null,
                null,
                null,
                null,
                [],
                ['reason' => 'missing_google_email'],
                $request
            );
            return response('Google email is missing.', 401);
        }

        $firstName = trim((string) $googleUser->user['given_name'] ?? '');
        $lastName = trim((string) $googleUser->user['family_name'] ?? '');

        $existing = DB::table('users')->where('email', $email)->first();
        if ($existing && $existing->status === 'suspended') {
            AuditLog::write(
                'auth.google_login_failed',
                'user',
                (int) $existing->id,
                (int) $existing->id,
                $email,
                $existing->role,
                [],
                ['reason' => 'account_suspended'],
                $request
            );
            return response('Account not active.', 403);
        }

        if ($existing) {
            DB::table('users')->where('id', $existing->id)->update([
                'first_name' => $existing->first_name ?: ($firstName ?: null),
                'last_name' => $existing->last_name ?: ($lastName ?: null),
                'email_verified_at' => $existing->email_verified_at ?: now(),
                'last_login_at' => now(),
                'status' => 'active',
                'updated_at' => now(),
            ]);
        } else {
            DB::table('users')->insert([
                'email' => $email,
                'first_name' => $firstName ?: null,
                'last_name' => $lastName ?: null,
                'birthdate' => null,
                'password_hash' => null,
                'otp_code' => null,
                'otp_expires_at' => null,
                'otp_attempts' => 0,
                'role' => 'member',
                'status' => 'active',
                'email_verified_at' => now(),
                'last_login_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $user = DB::table('users')->where('email', $email)->first();
        AuditLog::write(
            'auth.google_login_success',
            'user',
            (int) $user->id,
            (int) $user->id,
            $email,
            $user->role,
            [],
            ['method' => 'google'],
            $request
        );
        $profileComplete = (bool) ($user->first_name && $user->last_name && $user->birthdate);
        $clientOrigin = rtrim((string) env('CLIENT_ORIGIN', 'http://localhost:5173'), '/');
        $payload = rtrim(strtr(base64_encode(json_encode([
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'profileComplete' => $profileComplete,
        ])), '+/', '-_'), '=');

        return redirect($clientOrigin . '/#/oauth?payload=' . urlencode($payload));
    }
}
