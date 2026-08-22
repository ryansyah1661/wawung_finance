'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const INVENTORY = [
  { code: 'INV-A-001', name: 'Laptop Dell Latitude 5420', category: 'Elektronik', location: 'Gudang Pusat', qty: 8, unit: 'unit', status: 'available', value: 12000000, addedDate: '2023-08-15', notes: 'Kondisi baik, tersedia untuk peminjaman' },
  { code: 'INV-A-002', name: 'Kursi Kantor Ergonomis', category: 'Furniture', location: 'Lantai 2', qty: 24, unit: 'unit', status: 'available', value: 1500000, addedDate: '2023-05-10', notes: '' },
  { code: 'INV-A-003', name: 'Printer Epson L3210', category: 'Elektronik', location: 'Ruang Admin', qty: 2, unit: 'unit', status: 'low-stock', value: 2200000, addedDate: '2023-03-22', notes: 'Perlu restock cartridge' },
  { code: 'INV-A-004', name: 'Kertas A4 80gsm', category: 'ATK', location: 'Gudang Pusat', qty: 4, unit: 'rim', status: 'low-stock', value: 55000, addedDate: '2023-09-01', notes: '' },
  { code: 'INV-A-005', name: 'Proyektor Epson EB-X41', category: 'Elektronik', location: 'Ruang Meeting', qty: 0, unit: 'unit', status: 'out-of-stock', value: 5500000, addedDate: '2022-11-30', notes: 'Sedang diperbaiki di vendor' },
  { code: 'INV-A-006', name: 'Meja Kerja Standing Desk', category: 'Furniture', location: 'Lantai 3', qty: 12, unit: 'unit', status: 'available', value: 2800000, addedDate: '2023-06-18', notes: '' },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  available: { label: 'Tersedia', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'low-stock': { label: 'Stok Menipis', bg: 'bg-amber-50', text: 'text-amber-700' },
  'out-of-stock': { label: 'Habis', bg: 'bg-rose-50', text: 'text-rose-700' },
};

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function InventoryDetailPage() {
  const params = useParams();
  const code = params.code as string;
  const item = INVENTORY.find((i) => i.code === code);

  if (!item) {
    return (
      <div className="max-w-[600px] mx-auto text-center py-16">
        <span className="material-symbols-outlined text-slate-300 text-[48px]">search_off</span>
        <h2 className="text-xl font-bold text-slate-900 mt-4">Barang Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 mt-1">Kode barang &quot;{code}&quot; tidak terdaftar di sistem.</p>
        <Link href="/inventory" className="inline-block mt-6 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:brightness-110 transition-colors">
          Kembali ke Inventaris
        </Link>
      </div>
    );
  }

  const status = STATUS_CONFIG[item.status];
  const detailUrl = typeof window !== 'undefined' ? `${window.location.origin}/inventory/${item.code}` : '';
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(detailUrl)}`;

  return (
    <div className="max-w-[800px] mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/inventory"
          className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{item.name}</h2>
          <p className="text-sm text-slate-500 font-mono">{item.code}</p>
        </div>
        <span className={`ml-auto inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* QR Code Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center gap-3">
          <img src={qrImageUrl} alt={`QR Code ${item.code}`} className="w-40 h-40" />
          <p className="text-xs text-slate-400 text-center">Scan untuk membuka halaman ini</p>
          <a
            href={qrImageUrl}
            download={`qr-${item.code}.png`}
            className="w-full text-center px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Download QR
          </a>
        </div>

        {/* Info Card */}
        <div className="sm:col-span-2 bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Informasi Barang</h3>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kategori</p>
              <p className="text-sm text-slate-900">{item.category}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lokasi</p>
              <p className="text-sm text-slate-900">{item.location}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Stok</p>
              <p className="text-sm text-slate-900 font-mono">{item.qty} {item.unit}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nilai/Unit</p>
              <p className="text-sm text-slate-900 font-mono">{formatRupiah(item.value)}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tanggal Terdaftar</p>
              <p className="text-sm text-slate-900">{item.addedDate}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Nilai</p>
              <p className="text-sm text-primary font-mono font-semibold">{formatRupiah(item.qty * item.value)}</p>
            </div>
          </div>

          {item.notes && (
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Catatan</p>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">{item.notes}</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}