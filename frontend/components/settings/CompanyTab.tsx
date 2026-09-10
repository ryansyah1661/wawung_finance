'use client';

import React, { useState } from 'react';

export default function CompanyTab() {
    const [company, setCompany] = useState({
        name: 'Wawung Finance',
        currency: 'IDR - Rupiah',
        dateFormat: 'DD/MM/YYYY',
        address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Connect to API Laravel update company setting
        alert('Informasi Perusahaan berhasil diperbarui!');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Informasi Perusahaan</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="col-span-full">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Perusahaan</label>
                    <input
                        type="text"
                        value={company.name}
                        onChange={(e) => setCompany({ ...company, name: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mata Uang Default</label>
                    <select
                        value={company.currency}
                        onChange={(e) => setCompany({ ...company, currency: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
                    >
                        <option value="IDR - Rupiah">IDR - Rupiah</option>
                        <option value="USD - Dollar">USD - Dollar</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Format Tanggal</label>
                    <select
                        value={company.dateFormat}
                        onChange={(e) => setCompany({ ...company, dateFormat: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
                    >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                </div>
                <div className="col-span-full">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alamat</label>
                    <textarea
                        value={company.address}
                        onChange={(e) => setCompany({ ...company, address: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none h-20"
                    />
                </div>
            </div>

            <div className="pt-2">
                <button type="submit" className="bg-primary text-white hover:brightness-110 transition-colors px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer shadow-sm">
                    Simpan Perubahan
                </button>
            </div>
        </form>
    );
}