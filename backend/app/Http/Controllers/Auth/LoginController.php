<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Menampilkan halaman login Blade.
     */
    public function index()
    {
        return view('auth.login');
    }

    /**
     * Memproses autentikasi form login (POST).
     */
    public function store(Request $request)
    {
        // 1. Validasi input dari form
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 2. Coba cocokkan kredensial + cek checkbox "Remember Me"
        $remember = $request->has('remember');

        if (Auth::attempt($credentials, $remember)) {
            // Buat ulang session ID demi keamanan (mencegah session fixation)
            $request->session()->regenerate();

            // Redirect ke halaman dashboard atau URL yang diakses sebelum dipaksa login
            return redirect()->intended('/dashboard');
        }

        // 3. Jika login gagal, kembalikan ke login dengan pesan error
        return back()->withErrors([
            'email' => 'Email atau password yang kamu masukkan salah.',
        ])->onlyInput('email');
    }

    /**
     * Memproses Logout.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}