<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

// Redirect semua halaman web ke Next.js frontend
Route::get('/', function () {
    return redirect('http://localhost:3000/login');
});

Route::get('/login', function () {
    return redirect('http://localhost:3000/login');
})->name('login');

Route::get('/dashboard', function () {
    return redirect('http://localhost:3000/dashboard');
})->name('dashboard');

// Logout tetap bisa dari Laravel
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/forgot-password', function () {
    return redirect('http://localhost:3000/login');
})->name('password.request');
