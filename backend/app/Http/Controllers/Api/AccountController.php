<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Account::all();

        return response()->json([
            'success' => true,
            'data'    => $accounts
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_number' => 'required|string|unique:accounts,account_number',
            'name'           => 'required|string|max:255',
            'type'           => 'required|string',
            'balance'        => 'nullable|numeric|min:0',
            'status'         => 'nullable|string|in:active,inactive',
        ]);

        if (!isset($validated['balance'])) {
            $validated['balance'] = 0;
        }

        if (!isset($validated['status'])) {
            $validated['status'] = 'active';
        }

        $account = Account::create($validated);

        ActivityLogController::log('create', "Menambahkan akun/rekening baru: {$account->name} ({$account->account_number})");

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil ditambahkan',
            'data'    => $account
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        return response()->json([
            'success' => true,
            'data'    => $account
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account)
    {
        $validated = $request->validate([
            'account_number' => 'sometimes|string|unique:accounts,account_number,' . $account->id,
            'name'           => 'sometimes|string|max:255',
            'type'           => 'sometimes|string',
            'balance'        => 'sometimes|numeric|min:0',
            'status'         => 'sometimes|string|in:active,inactive',
        ]);

        $account->update($validated);

        ActivityLogController::log('update', "Mengubah data akun/rekening: {$account->name}");

        return response()->json([
            'success' => true,
            'message' => 'Data akun berhasil diperbarui',
            'data'    => $account
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        $accountName = $account->name;

        $account->delete();

        ActivityLogController::log('delete', "Menghapus akun/rekening: {$accountName}");

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil dihapus'
        ], 200);
    }
}
