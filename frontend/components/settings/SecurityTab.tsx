'use client';

import React, { useState } from 'react';

export default function SecurityTab() {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [twoFactor, setTwoFactor] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert('Konfirmasi password baru tidak cocok!');
            return;
        }
        // TODO: Connect to API Laravel update password
        alert('Password berhasil diubah!');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Keamanan Akun</h3>

            <div className="space-y-5">
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password Saat Ini</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password Baru</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Konfirmasi Password Baru</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500 mt-0.5">Tambahkan lapisan keamanan ekstra saat login</p>
                </div>
                <button
                    type="button"
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${twoFactor ? 'bg-primary' : 'bg-slate-200'
                        }`}
                >
                    <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${twoFactor ? 'left-5' : 'left-0.5'
                            }`}
                    ></span>
                </button>
            </div>

            <div className="pt-2">
                <button type="submit" className="bg-primary text-white hover:brightness-110 transition-colors px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer shadow-sm">
                    Update Password
                </button>
            </div>
        </form>
    );
}