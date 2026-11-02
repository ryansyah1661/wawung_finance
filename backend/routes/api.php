<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\FundRequestController;
use App\Http\Controllers\Api\ReimbursementController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectHierarchyController;

// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Master Data
Route::apiResource('accounts', AccountController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('departments', DepartmentController::class);

// Project Hierarchy / LFA & RAB Routes
Route::get('/programs/{programId}/hierarchy', [ProjectHierarchyController::class, 'getHierarchy']);
Route::post('/programs/{programId}/outcomes', [ProjectHierarchyController::class, 'storeOutcome']);
Route::put('/outcomes/{id}', [ProjectHierarchyController::class, 'updateOutcome']);
Route::delete('/outcomes/{id}', [ProjectHierarchyController::class, 'deleteOutcome']);
Route::post('/outcomes/{outcomeId}/outputs', [ProjectHierarchyController::class, 'storeOutput']);
Route::put('/outputs/{id}', [ProjectHierarchyController::class, 'updateOutput']);
Route::delete('/outputs/{id}', [ProjectHierarchyController::class, 'deleteOutput']);
Route::post('/outputs/{outputId}/activities', [ProjectHierarchyController::class, 'storeActivity']);
Route::put('/activities/{id}', [ProjectHierarchyController::class, 'updateActivity']);
Route::delete('/activities/{id}', [ProjectHierarchyController::class, 'deleteActivity']);
Route::get('/activities/{activityId}/components', [ProjectHierarchyController::class, 'getComponents']);
Route::post('/activities/{activityId}/components', [ProjectHierarchyController::class, 'storeComponent']);
Route::put('/components/{id}', [ProjectHierarchyController::class, 'updateComponent']);
Route::delete('/components/{id}', [ProjectHierarchyController::class, 'deleteComponent']);

// Transactions
Route::apiResource('transactions', TransactionController::class);

// Fund Requests
Route::apiResource('fund-requests', FundRequestController::class);
Route::patch('fund-requests/{id}/status', [FundRequestController::class, 'updateStatus']);

// Reimbursements
Route::get('/reimbursements', [ReimbursementController::class, 'index']);
Route::post('/reimbursements', [ReimbursementController::class, 'store']);
Route::get('/reimbursements/{id}', [ReimbursementController::class, 'show']);
Route::patch('/reimbursements/{id}/status', [ReimbursementController::class, 'updateStatus']);
Route::delete('/reimbursements/{id}', [ReimbursementController::class, 'destroy']);

// Invoices
Route::apiResource('invoices', InvoiceController::class);

// Users
Route::apiResource('users', UserController::class);
Route::put('/user-profile', [UserController::class, 'updateProfile']);

// Activity Logs
Route::get('/activity-logs', [ActivityLogController::class, 'index']);

// Inventory
Route::apiResource('inventory', InventoryController::class)->parameters([
    'inventory' => 'code'
]);
