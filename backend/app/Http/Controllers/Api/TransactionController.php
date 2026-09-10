<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Transaction::query();

        if ($request->has('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'success' => true,
            'data' => $query->orderBy('date', 'desc')->paginate(10)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'description' => 'required|string',
            'category' => 'required|string',
            'account' => 'required|string',
            'type' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        $transaction = Transaction::create($validated);

        ActivityLogController::log('create', "Menambahkan transaksi: {$transaction->description}");

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil ditambahkan',
            'data' => $transaction
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $transaction = Transaction::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $transaction
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $transaction = Transaction::findOrFail($id);

        $validated = $request->validate([
            'date' => 'sometimes|date',
            'description' => 'sometimes|string',
            'category' => 'sometimes|string',
            'account' => 'sometimes|string',
            'type' => 'sometimes|string',
            'amount' => 'sometimes|numeric',
        ]);

        $transaction->update($validated);

        ActivityLogController::log('update', "Mengubah transaksi: {$transaction->description}");

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil diperbarui',
            'data' => $transaction
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $transaction = Transaction::findOrFail($id);
        $description = $transaction->description;

        $transaction->delete();

        ActivityLogController::log('delete', "Menghapus transaksi: {$description}");

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus'
        ]);
    }
}