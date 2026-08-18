'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  // State Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // State Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      // Nanti dihubungkan ke backend Laravel (POST /api/login)
      console.log('Logging in with:', { email, password, rememberMe });
      
      setTimeout(() => {
        setLoading(false);
        // Pindah route ke Dashboard
        router.push('/dashboard');
      }, 800);

    } catch (err: any) {
      setLoading(false);
      setErrorMessage(
        err.response?.data?.message || 'Login gagal, periksa email dan password Anda.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center antialiased font-sans">
      {/* Main Container Split Screen */}
      <div className="w-full h-screen flex overflow-hidden">
        
        {/* Kolom Kiri: Branding (Diposisikan di Tengah menggunakan justify-center) */}
        <div className="hidden lg:flex lg:w-1/2 bg-wawung-gradient-red p-12 xl:p-16 flex-col justify-center relative text-white">
          {/* Overlay Gelap */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Konten Teks di Tengah */}
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-6 border border-white/20">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              SECURE PORTAL
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight mb-5 leading-[1.15]">
              Financial intelligence,<br />
              centralized and secure.
            </h1>
            <p className="text-white/80 text-base xl:text-lg leading-relaxed">
              Akses ke dalam Kawung Finance Platform untuk mengelola laporan keuangan, transaksi internal, dan audit perusahaan secara terpusat.
            </p>
          </div>
          
          {/* Footer Kiri (Diposisikan di bawah dengan absolute agar tetap rapi) */}
          <div className="absolute bottom-8 left-12 xl:left-16 z-10 text-xs text-white/50 font-medium">
            © 2026 Kawungpitu Institute Finance. All rights reserved.
          </div>
        </div>

        {/* Kolom Kanan: Form Login */}
        <div className="w-full lg:w-1/2 bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center">

          {/* Form Title Section */}
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-center gap-2.5 mb-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Selamat Datang</h2>
            </div>
            <p className="text-sm text-slate-500 mb-8">Login untuk mengakses Internal Finance Kawung</p>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center font-medium">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Alamat Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@wawung.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Kata Sandi
                  </label>
                  <a href="#" className="text-xs font-semibold text-primary hover:underline transition-colors">
                    Lupa kata sandi?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center pt-1">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
                  Ingat saya
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-sm font-semibold text-primary-foreground bg-primary hover:bg-[#8b0a0e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer mt-2"
              >
                {loading ? 'MEMPROSES...' : 'Masuk'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}