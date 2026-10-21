<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login via API — mengembalikan data user sebagai JSON.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password yang kamu masukkan salah.',
            ], 401);
        }

        return response()->json([
            'message' => 'Login berhasil',
            'user'    => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => $user->role,
                'department' => $user->department,
                'phone'      => $user->phone,
                'position'   => $user->position,
            ],
        ]);
    }

    /**
     * Logout via API.
     */
    public function logout(Request $request)
    {
        return response()->json(['message' => 'Logout berhasil']);
    }
}
