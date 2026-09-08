<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransactionController;

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InventoryController;

Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);

// Categories
Route::apiResource('categories', CategoryController::class);

// Inventory
Route::apiResource('inventory', InventoryController::class)->parameters([
    'inventory' => 'code' // Use 'code' instead of 'id' for route model binding/params
]);