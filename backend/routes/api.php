<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\FundRequestController;
use App\Http\Controllers\Api\ReimbursementController;
use App\Http\Controllers\Api\InvoiceController;

// Transactions
Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);

// Categories
Route::apiResource('categories', CategoryController::class);

// Fund Requests
Route::apiResource('fund-requests', FundRequestController::class);
Route::patch('fund-requests/{id}/status', [FundRequestController::class, 'updateStatus']);

// Accounts
Route::apiResource('accounts', AccountController::class);

// Reimbursements
Route::get('/reimbursements', [ReimbursementController::class, 'index']);
Route::post('/reimbursements', [ReimbursementController::class, 'store']);
Route::get('/reimbursements/{id}', [ReimbursementController::class, 'show']);
Route::patch('/reimbursements/{id}/status', [ReimbursementController::class, 'updateStatus']);
Route::delete('/reimbursements/{id}', [ReimbursementController::class, 'destroy']);

// Invoices
Route::apiResource('invoices', InvoiceController::class);

// Inventory
Route::apiResource('inventory', InventoryController::class)->parameters([
    'inventory' => 'code'
]);