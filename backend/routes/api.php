// Contoh di routes/api.php
Route::middleware('auth:sanctum')->get('/transactions', [TransactionController::class, 'index']);