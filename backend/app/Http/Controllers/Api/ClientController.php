<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Client::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('company', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'success' => true,
            'data'    => $query->orderBy('name', 'asc')->get()
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'email'   => 'nullable|email|max:255',
            'phone'   => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        $client = Client::create($validated);

        $clientInfo = $client->company ? "{$client->name} ({$client->company})" : $client->name;
        ActivityLogController::log('create', "Menambahkan klien baru: {$clientInfo}");

        return response()->json([
            'success' => true,
            'message' => 'Klien berhasil ditambahkan',
            'data'    => $client
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $client], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'name'    => 'sometimes|string|max:255',
            'company' => 'nullable|string|max:255',
            'email'   => 'nullable|email|max:255',
            'phone'   => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        $client->update($validated);

        ActivityLogController::log('update', "Mengubah data klien: {$client->name}");

        return response()->json([
            'success' => true,
            'message' => 'Data klien berhasil diperbarui',
            'data'    => $client
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $name = $client->name;
        $client->delete();

        ActivityLogController::log('delete', "Menghapus klien: {$name}");

        return response()->json([
            'success' => true,
            'message' => 'Klien berhasil dihapus'
        ], 200);
    }
}
