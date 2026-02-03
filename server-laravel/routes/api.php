<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/health', function () {
    return response()->json(['ok' => true]);
});

Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/auth/cancel-signup', [AuthController::class, 'cancelSignup']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::options('/{any}', function () {
    return response()->noContent();
})->where('any', '.*');
