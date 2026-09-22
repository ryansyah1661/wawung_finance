'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<string>('2');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        password: '',
        password_confirmation: '',
    });
    const [infoModal, setInfoModal] = useState({ show: false, title: '', message: '', type: 'success' as 'success' | 'warning' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const id = localStorage.getItem('user_id') || '2';
                setUserId(id);
                const res = await api.get(`/users/${id}`);
                if (res.data) {
                    setFormData(prev => ({
                        ...prev,
                        name: res.data.name || '',
                        email: res.data.email || '',
                        phone: res.data.phone || '',
                        position: res.data.position || '',
                    }));
                }
            } catch (e) {
                console.error('Failed to fetch user', e);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.password_confirmation) {
            setInfoModal({ show: true, title: 'Error', message: 'Konfirmasi password baru tidak cocok!', type: 'warning' });
            return;
        }

        setSaving(true);
        try {
            const payload: any = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                position: formData.position,
            };
            
            // Only send password if user wants to change it
            if (formData.password) {
                payload.password = formData.password;
            }

            await api.put(`/users/${userId}`, payload);

            setInfoModal({ show: true, title: 'Berhasil', message: 'Profil dan pengaturan berhasil diperbarui!', type: 'success' });
            // Clear password fields after success
            setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }));
            
            // Dispatch event so TopNav updates instantly
            window.dispatchEvent(new Event('userProfileUpdated'));
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Gagal terhubung ke backend Laravel.';
            setInfoModal({ show: true, title: 'Error', message: msg, type: 'warning' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-[700px] mx-auto space-y-6">

            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Pengaturan Profil</h2>
                <p className="text-sm text-slate-500 mt-1">Kelola data diri, email, dan password Anda</p>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Avatar Section */}
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-white outline outline-1 outline-slate-200 flex items-center justify-center text-blue-700 font-bold text-2xl shadow-sm">
                            {formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'RS'}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">{formData.name || 'User'}</h3>
                            <p className="text-xs text-slate-500">{formData.position || 'Staff'}</p>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Data Diri */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-4">Informasi Pribadi</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nomor Telepon</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jabatan</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Keamanan */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-4">Keamanan (Ubah Password)</h4>
                        <p className="text-xs text-slate-500 mb-4">Kosongkan kolom password jika Anda tidak ingin mengubahnya.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password Baru</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Konfirmasi Password Baru</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="password_confirmation"
                                        placeholder="••••••••"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            {showConfirmPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 bg-primary hover:brightness-110 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
                        >
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Info Modal */}
            {infoModal.show && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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