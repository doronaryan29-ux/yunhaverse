<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AdminDataController;
use App\Http\Controllers\DonationsController;

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
Route::get('/admin/creative-requests', [AdminDataController::class, 'creativeRequests']);
Route::get('/admin/creative-submissions', [AdminDataController::class, 'creativeSubmissions']);
Route::post('/admin/creative-requests', [AdminDataController::class, 'storeCreativeRequest']);
Route::post('/admin/creative-requests/{id}', [AdminDataController::class, 'updateCreativeRequest']);
Route::post('/admin/creative-requests/{id}/delete', [AdminDataController::class, 'deleteCreativeRequest']);
Route::post('/admin/creative-submissions', [AdminDataController::class, 'storeCreativeSubmission']);
Route::post('/admin/creative-submissions/{id}', [AdminDataController::class, 'updateCreativeSubmission']);
Route::post('/admin/creative-submissions/{id}/delete', [AdminDataController::class, 'deleteCreativeSubmission']);
Route::get('/admin/donations', [AdminDataController::class, 'donations']);
Route::get('/admin/events', [AdminDataController::class, 'events']);
Route::post('/admin/events', [AdminDataController::class, 'storeEvent']);
Route::post('/admin/events/{id}', [AdminDataController::class, 'updateEvent']);
Route::post('/admin/events/{id}/delete', [AdminDataController::class, 'deleteEvent']);
Route::post('/donations', [DonationsController::class, 'store']);
Route::post('/admin/donations', [DonationsController::class, 'storeAdmin']);
Route::post('/admin/donations/{id}', [DonationsController::class, 'updateAdmin']);
Route::post('/admin/donations/{id}/delete', [DonationsController::class, 'deleteAdmin']);

Route::options('/{any}', function () {
    return response()->noContent();
})->where('any', '.*');
