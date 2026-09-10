<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'role'       => 'required|in:superadmin,director,finance,pm',
            'department' => 'nullable|string|max:255',
            'phone'      => 'nullable|string|max:20',
            'position'   => 'nullable|string|max:255',
            'password'   => 'nullable|string|min:6',
        ]);

        $validated['password'] = Hash::make($validated['password'] ?? 'password123');

        $user = User::create($validated);

        ActivityLogController::log('create', "Menambahkan user: {$user->name} ({$user->role})");

        return response()->json([
            'message' => 'User berhasil dibuat',
            'data'    => $user
        ], 201);
    }

    public function show($id)
    {
        return response()->json(User::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        // Cari user berdasarkan ID, jika tidak ada (misal ID 1 kosong), ambil user pertama yang ada di database
        $user = User::find($id) ?? User::first();

        // Jika tabel users benar-benar kosong, buatkan user baru dengan password default
        if (!$user) {
            $user = User::create([
                'name'     => $request->name ?? 'Ryan Syah',
                'email'    => $request->email ?? 'ryan@kawungpitu.org',
                'role'     => 'superadmin',
                'password' => Hash::make('password123'),
            ]);
        }

        $validated = $request->validate([
            'name'       => 'sometimes|string|max:255',
            'email'      => 'sometimes|email|unique:users,email,' . $user->id,
            'role'       => 'sometimes|in:superadmin,director,finance,pm',
            'department' => 'nullable|string|max:255',
            'phone'      => 'nullable|string|max:20',
            'position'   => 'nullable|string|max:255',
            'password'   => 'nullable|string|min:6',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        ActivityLogController::log('update', "Memperbarui data user: {$user->name} ({$user->role})");

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'data'    => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $userName = $user->name;
        $user->delete();

        ActivityLogController::log('delete', "Menghapus user: {$userName} (ID: {$id})");

        return response()->json([
            'message' => 'User berhasil dihapus'
        ], 200);
    }
}
