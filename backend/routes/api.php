<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Pastikan route ini ada di api.php
Route::get('/transactions', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Koneksi Next.js ke Laravel Berhasil!',
        'data' => [
            [
                'id' => 1,
                'type' => 'income',
                'category' => 'Pemasukan Kas BPH',
                'amount' => 15000000,
                'date' => '2026-07-24'
            ],
            [
                'id' => 2,
                'type' => 'expense',
                'category' => 'Pembelian Material',
                'amount' => 4500000,
                'date' => '2026-07-24'
            ],
        ]
    ]);
});