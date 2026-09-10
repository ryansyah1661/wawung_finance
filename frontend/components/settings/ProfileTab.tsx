'use client';

import React, { useState } from 'react';
import api from '@/lib/api';

export default function ProfileTab() {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: 'Ryan Syah',
        email: 'ryan@kawungpitu.org',
        phone: '082112102262',
        position: 'Specialist IT',
    });
    const [infoModal, setInfoModal] = useState({ show: false, title: '', message: '', type: 'success' as 'success' | 'warning' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const userId = 1;

        try {
            await api.put(`/users/${userId}`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                position: formData.position,
            });

            setInfoModal({ show: true, title: 'Berhasil', message: 'Profil berhasil diperbarui!', type: 'success' });
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Gagal terhubung ke backend Laravel.';
            setInfoModal({ show: true, title: 'Error', message: msg, type: 'warning' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Profil Pengguna</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-xl">
                        {formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <button
                        type="button"
                        className="text-sm font-semibold text-rose-800 hover:text-rose-900 cursor-pointer"
                    >
                        Ganti Foto
                    </button>
                </div>

                {/* Form Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            NAMA LENGKAP
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            EMAIL
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            NOMOR TELEPON
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            JABATAN
                        </label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-rose-800 hover:bg-rose-900 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>

            {/* Info Modal */}
            {infoModal.show && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="p-6 text-center space-y-4">
                            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                                infoModal.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                                <span className="material-symbols-outlined text-3xl">
                                    {infoModal.type === 'success' ? 'check_circle' : 'warning'}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{infoModal.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{infoModal.message}</p>
                            <div className="pt-2">
                                <button
                                    onClick={() => setInfoModal({ ...infoModal, show: false })}
                                    className={`w-full py-2.5 px-4 rounded-xl text-white font-semibold shadow-sm transition-colors cursor-pointer ${
                                        infoModal.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'
                                    }`}
                                >
                                    Mengerti
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}