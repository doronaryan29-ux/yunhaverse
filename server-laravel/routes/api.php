<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AdminDataController;

Route::get('/health', function () {
    return response()->json(['ok' => true]);
});

Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/auth/cancel-signup', [AuthController::class, 'cancelSignup']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'sendPasswordResetOtp']);
Route::post('/auth/verify-reset-otp', [AuthController::class, 'verifyPasswordResetOtp']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/auth/google/redirect', [AuthController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [AuthController::class, 'googleCallback']);
Route::get('/notifications', [NotificationController::class, 'index']);
Route::post('/admin/notifications', [NotificationController::class, 'store']);
Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
Route::get('/admin/stats', [NotificationController::class, 'adminStats']);
Route::get('/users/{id}/profile', [UserController::class, 'profile']);
Route::post('/users/{id}/profile', [UserController::class, 'updateProfile']);
Route::get('/admin/audit-logs', [AuditLogController::class, 'index']);
Route::get('/admin/audit-flags', [AuditLogController::class, 'flags']);
Route::post('/admin/audit-flags', [AuditLogController::class, 'storeFlag']);
Route::post('/admin/audit-flags/{id}/resolve', [AuditLogController::class, 'resolveFlag']);
Route::get('/admin/upcoming-events', [AdminDataController::class, 'upcomingEvents']);
Route::get('/admin/members-creative', [AdminDataController::class, 'membersCreativeStaff']);

Route::options('/{any}', function () {
    return response()->noContent();
})->where('any', '.*');
