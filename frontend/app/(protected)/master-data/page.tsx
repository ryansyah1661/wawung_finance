'use client';

import React, { useState } from 'react';

type TabKey = 'accounts' | 'categories' | 'departments' | 'vendors';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'accounts', label: 'Akun Bank/Kas', icon: 'account_balance' },
  { key: 'categories', label: 'Kategori Transaksi', icon: 'category' },
  { key: 'departments', label: 'Departemen', icon: 'apartment' },
  { key: 'vendors', label: 'Vendor/Klien', icon: 'storefront' },
];

const DATA: Record<TabKey, { name: string; detail: string; status: 'active' | 'inactive' }[]> = {
  accounts: [
    { name: 'BCA Utama', detail: 'No. Rek: 1234567890', status: 'active' },
    { name: 'Mandiri Bisnis', detail: 'No. Rek: 0987654321', status: 'active' },
    { name: 'Kas Kecil', detail: 'Petty cash - kantor pusat', status: 'active' },
    { name: 'Kartu Kredit Perusahaan', detail: 'BCA Visa Business', status: 'active' },
  ],
  categories: [
    { name: 'Operations', detail: 'Biaya operasional harian', status: 'active' },
    { name: 'Marketing', detail: 'Promosi & iklan', status: 'active' },
    { name: 'Payroll', detail: 'Gaji & tunjangan karyawan', status: 'active' },
    { name: 'IT & Tech', detail: 'Software, hosting, hardware', status: 'active' },
    { name: 'Legacy Category', detail: 'Sudah tidak dipakai', status: 'inactive' },
  ],
  departments: [
    { name: 'Sales', detail: '12 karyawan', status: 'active' },
    { name: 'Marketing', detail: '8 karyawan', status: 'active' },
    { name: 'Operations', detail: '15 karyawan', status: 'active' },
    { name: 'Finance', detail: '5 karyawan', status: 'active' },
    { name: 'HR', detail: '4 karyawan', status: 'active' },
  ],
  vendors: [
    { name: 'PT Alpha', detail: 'Klien - Kontrak retainer', status: 'active' },
    { name: 'CV Beta', detail: 'Klien - Project based', status: 'active' },
    { name: 'PT Maju Bersama', detail: 'Klien - Kontrak retainer', status: 'active' },
    { name: 'Vendor Lama Inc.', detail: 'Sudah tidak aktif', status: 'inactive' },
  ],
};

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('accounts');
  const items = DATA[activeTab];

  return (
    <div className="max-w-300 mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Master Data</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola data referensi yang dipakai di seluruh aplikasi</p>
        </div>
        <button className="bg-primary text-white hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Tambah Data
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-1.5 flex flex-wrap gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
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

      {/* Table Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3">Nama</th>
                <th className="p-3">Detail</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.name} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-3 font-medium text-slate-900">{item.name}</td>
                  <td className="p-3 text-slate-500">{item.detail}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        item.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Edit">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Hapus">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}