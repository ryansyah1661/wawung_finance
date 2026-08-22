'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function NewInventoryItemPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [savedCode, setSavedCode] = useState<string | null>(null);

  const handleSave = () => {
    // TODO: replace with real API call to Laravel backend, use the returned code
    const generatedCode = `INV-A-${Math.floor(100 + Math.random() * 900)}`;
    setSavedCode(generatedCode);
  };

  if (savedCode) {
    const detailUrl = typeof window !== 'undefined' ? `${window.location.origin}/inventory/${savedCode}` : '';
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(detailUrl)}`;

    return (
      <div className="max-w-[600px] mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="material-symbols-outlined text-emerald-500 text-[40px]">check_circle</span>
          <h2 className="text-2xl font-bold text-slate-900">Barang Berhasil Ditambahkan</h2>
          <p className="text-sm text-slate-500">
            <span className="font-mono font-semibold text-slate-900">{savedCode}</span> — {name || 'Barang baru'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 flex flex-col items-center gap-4">
          <img src={qrImageUrl} alt={`QR Code ${savedCode}`} className="w-56 h-56" />
          <p className="text-xs text-slate-400 text-center max-w-xs">
            Cetak dan tempelkan QR ini di barang. Scan QR akan membuka halaman detail barang ini.
          </p>
          <div className="flex gap-3 w-full">
            <a
              href={qrImageUrl}
              download={`qr-${savedCode}.png`}
              className="flex-1 text-center px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Download QR
            </a>
            <button
              onClick={() => window.print()}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:brightness-110 transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Print
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            href={`/inventory/${savedCode}`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Lihat detail barang
          </Link>
          <span className="text-slate-300">•</span>
          <Link
            href="/inventory"
            className="text-sm font-semibold text-slate-500 hover:underline"
          >
            Kembali ke daftar inventaris
          </Link>
        </div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-slate-900">Tambah Barang Inventaris</h2>
          <p className="text-sm text-slate-500">Daftarkan aset atau stok barang baru</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-5">

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Barang</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Laptop Dell Latitude 5420"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
            >
              <option value="">Pilih kategori...</option>
              <option>Elektronik</option>
              <option>Furniture</option>
              <option>ATK</option>
              <option>Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lokasi Penyimpanan</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Gudang Pusat"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah Stok</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="0"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-mono placeholder-slate-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Satuan</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="unit, rim, pcs..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nilai/Unit (Rp)</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-mono placeholder-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Catatan (Opsional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Kondisi barang, nomor seri, dsb..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none h-20 placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Foto Barang (Opsional)</label>
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-slate-400 text-[28px]">add_a_photo</span>
            <p className="text-sm text-slate-500">Klik untuk upload foto</p>
            <p className="text-xs text-slate-400">PNG, JPG maksimal 5MB</p>
          </div>
        </div>

      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <span className="material-symbols-outlined text-blue-600 text-[20px]">qr_code_2</span>
        <p className="text-sm text-blue-800">
          Setelah disimpan, QR code otomatis dibuat untuk barang ini — siap dicetak dan ditempelkan.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/inventory"
          className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          Batal
        </Link>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:brightness-110 transition-colors cursor-pointer shadow-sm"
        >
          Simpan Barang
        </button>
      </div>

    </div>
  );
}