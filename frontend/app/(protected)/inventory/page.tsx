'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const INVENTORY = [
  { code: 'INV-A-001', name: 'Laptop Dell Latitude 5420', category: 'Elektronik', location: 'Gudang Pusat', qty: 8, unit: 'unit', status: 'available', value: 12000000 },
  { code: 'INV-A-002', name: 'Kursi Kantor Ergonomis', category: 'Furniture', location: 'Lantai 2', qty: 24, unit: 'unit', status: 'available', value: 1500000 },
  { code: 'INV-A-003', name: 'Printer Epson L3210', category: 'Elektronik', location: 'Ruang Admin', qty: 2, unit: 'unit', status: 'low-stock', value: 2200000 },
  { code: 'INV-A-004', name: 'Kertas A4 80gsm', category: 'ATK', location: 'Gudang Pusat', qty: 4, unit: 'rim', status: 'low-stock', value: 55000 },
  { code: 'INV-A-005', name: 'Proyektor Epson EB-X41', category: 'Elektronik', location: 'Ruang Meeting', qty: 0, unit: 'unit', status: 'out-of-stock', value: 5500000 },
  { code: 'INV-A-006', name: 'Meja Kerja Standing Desk', category: 'Furniture', location: 'Lantai 3', qty: 12, unit: 'unit', status: 'available', value: 2800000 },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  available: { label: 'Tersedia', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'low-stock': { label: 'Stok Menipis', bg: 'bg-amber-50', text: 'text-amber-700' },
  'out-of-stock': { label: 'Habis', bg: 'bg-rose-50', text: 'text-rose-700' },
};

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const totalValue = INVENTORY.reduce((sum, item) => sum + item.qty * item.value, 0);
  const lowStockCount = INVENTORY.filter((i) => i.status === 'low-stock').length;
  const outOfStockCount = INVENTORY.filter((i) => i.status === 'out-of-stock').length;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventaris</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola aset dan stok barang perusahaan</p>
        </div>
        <Link href="/inventory/new-inventory" className="bg-primary text-white hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          Tambah Barang
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Item</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{INVENTORY.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Nilai Aset</p>
            <p className="text-lg font-bold text-slate-900 font-mono">Rp {(totalValue / 1000000).toFixed(1)}M</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">payments</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Stok Menipis</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{lowStockCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Stok Habis</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{outOfStockCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <span className="material-symbols-outlined text-[20px]">remove_shopping_cart</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-50">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nama barang, kode..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>
        <div className="w-48">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kategori</label>
          <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer">
            <option>Semua Kategori</option>
            <option>Elektronik</option>
            <option>Furniture</option>
            <option>ATK</option>
          </select>
        </div>
        <div className="w-44">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
          <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer">
            <option>Semua Status</option>
            <option>Tersedia</option>
            <option>Stok Menipis</option>
            <option>Habis</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3">Kode</th>
                <th className="p-3">Nama Barang</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Lokasi</th>
                <th className="p-3 text-right">Stok</th>
                <th className="p-3 text-right">Nilai/Unit</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 w-20 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {INVENTORY.map((item) => {
                const status = STATUS_CONFIG[item.status];
                return (
                  <tr key={item.code} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-3 font-mono text-xs text-slate-500">{item.code}</td>
                    <td className="p-3 font-medium text-slate-900">{item.name}</td>
                    <td className="p-3 text-slate-500">{item.category}</td>
                    <td className="p-3 text-slate-500">{item.location}</td>
                    <td className="p-3 text-right font-mono text-slate-900">{item.qty} {item.unit}</td>
                    <td className="p-3 text-right font-mono text-slate-500">{formatRupiah(item.value)}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Edit">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}