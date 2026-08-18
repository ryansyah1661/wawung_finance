'use client';

import React, { useState } from 'react';

type TabKey = 'profile' | 'company' | 'security' | 'notifications';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'profile', label: 'Profil', icon: 'person' },
  { key: 'company', label: 'Perusahaan', icon: 'apartment' },
  { key: 'security', label: 'Keamanan', icon: 'lock' },
  { key: 'notifications', label: 'Notifikasi', icon: 'notifications' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  return (
    <div className="max-w-250 mx-auto space-y-6">

      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola profil, perusahaan, dan preferensi aplikasi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-1.5 flex lg:flex-col gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">

          {activeTab === 'profile' && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Profil Pengguna</h3>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                  AW
                </div>
                <button className="text-sm font-semibold text-primary">Ganti Foto</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    defaultValue="Ahmad Wijaya"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    type="email"
                    defaultValue="ahmad@wawung.finance"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nomor Telepon</label>
                  <input
                    type="tel"
                    defaultValue="+62 812-3456-7890"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jabatan</label>
                  <input
                    type="text"
                    defaultValue="Superadmin"
                    disabled
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button className="bg-primary text-white hover:brightness-110 transition-colors px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer shadow-sm">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Informasi Perusahaan</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="col-span-full">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Perusahaan</label>
                  <input
                    type="text"
                    defaultValue="Wawung Finance"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mata Uang Default</label>
                  <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer">
                    <option>IDR - Rupiah</option>
                    <option>USD - Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Format Tanggal</label>
                  <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="col-span-full">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alamat</label>
                  <textarea
                    defaultValue="Jl. Sudirman No. 123, Jakarta Selatan"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none h-20"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button className="bg-primary text-white hover:brightness-110 transition-colors px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer shadow-sm">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Keamanan Akun</h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password Saat Ini</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password Baru</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tambahkan lapisan keamanan ekstra saat login</p>
                </div>
                <button className="relative w-11 h-6 bg-slate-200 rounded-full transition-colors cursor-pointer">
                  <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform"></span>
                </button>
              </div>

              <div className="pt-2">
                <button className="bg-primary text-white hover:brightness-110 transition-colors px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer shadow-sm">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-5">Preferensi Notifikasi</h3>

              {[
                { label: 'Pengajuan baru menunggu approval', desc: 'Dapatkan notifikasi saat ada fund request atau reimbursement baru', enabled: true },
                { label: 'Invoice jatuh tempo', desc: 'Pengingat 3 hari sebelum invoice jatuh tempo', enabled: true },
                { label: 'Transaksi besar', desc: 'Notifikasi untuk transaksi di atas Rp 10.000.000', enabled: false },
                { label: 'Ringkasan mingguan', desc: 'Laporan ringkas performa keuangan tiap Senin pagi', enabled: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                  <div className="pr-4">
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                      item.enabled ? 'bg-primary' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
                        item.enabled ? 'left-5' : 'left-0.5'
                      }`}
                    ></span>
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}