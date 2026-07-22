<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

// Redirect halaman depan ke login
Route::get('/', function () {
    return redirect()->route('login');
});

// Route Autentikasi
Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::post('/login', [LoginController::class, 'store']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/forgot-password', function () {
    return 'Halaman Lupa Password';
})->name('password.request');

// Route Dashboard (Memerlukan Login)
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});