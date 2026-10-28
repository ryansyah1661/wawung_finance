'use client';

import React, { useState, useEffect, use } from 'react';
import api from '@/lib/api';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  baik: { label: 'Baik', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  available: { label: 'Baik', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'tidak-rusak': { label: 'Baik', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'low-stock': { label: 'Baik', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'rusak-ringan': { label: 'Rusak Ringan', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'rusak-berat': { label: 'Rusak Berat', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  rusak: { label: 'Rusak Berat', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  damaged: { label: 'Rusak Berat', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  'out-of-stock': { label: 'Rusak Berat', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
};

function formatRupiah(amount: number) {
  return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
}

export default function PublicScanPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: rawCode } = use(params);
  const code = decodeURIComponent(rawCode);

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/inventory/${code}`)
      .then(res => {
        setItem(res.data);
      })
      .catch(err => {
        console.error('Gagal mengambil data aset:', err);
        setItem(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code]);

  const photoUrl = item?.photo
    ? (item.photo.includes('/storage/')
        ? '/storage/' + item.photo.split('/storage/')[1]
        : item.photo)
    : null;

  const status = item ? (STATUS_CONFIG[item.status] || STATUS_CONFIG.baik) : STATUS_CONFIG.baik;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-sm w-full text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Memverifikasi Kode Aset...</p>
          <p className="text-xs text-slate-400 font-mono">{code}</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-sm w-full text-center space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[32px]">search_off</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Aset Tidak Ditemukan</h2>
            <p className="text-xs text-slate-500 mt-1">
              Kode inventaris <span className="font-mono font-semibold text-slate-700">{code}</span> tidak terdaftar dalam sistem resmi Kawungpitu.
            </p>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            Kawungpitu Asset Verification System
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center justify-center antialiased">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        
        {/* Header Branding (Locked - Read-Only) */}
        <div className="bg-primary px-6 py-5 text-white text-center relative">
          <h2 className="font-extrabold text-lg tracking-wider uppercase">Inventaris</h2>
          <p className="text-xs text-white/80 font-medium mt-0.5">Kawungpitu Institute</p>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-[11px] font-semibold text-white/90">
            <span className="material-symbols-outlined text-[14px] text-emerald-300">verified</span>
            Verifikasi Inventaris Resmi
          </div>
        </div>

        {/* Content Card */}
        <div className="p-6 space-y-5">
          
          {/* Item Main Info */}
          <div className="text-center pb-4 border-b border-slate-100">
            <span className="text-xs font-mono font-bold text-primary bg-rose-50 px-3 py-1 rounded-full border border-rose-100 inline-block mb-2">
              {item.code}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{item.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>

            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs border border-slate-200/60" style={{ background: status.bg }}>
              <span className={`w-2 h-2 rounded-full ${status.dot}`} />
              <span className={status.text}>Kondisi: {status.label}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Lokasi</span>
              <span className="font-semibold text-slate-800">{item.location || '-'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Jumlah / Unit</span>
              <span className="font-semibold text-slate-800">{item.qty} {item.unit || 'Unit'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Nilai Satuan</span>
              <span className="font-semibold text-slate-800 font-mono">{formatRupiah(item.value)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Total Nilai</span>
              <span className="font-semibold text-primary font-mono">{formatRupiah(item.qty * item.value)}</span>
            </div>
          </div>

          {/* Tanggal Terdaftar */}
          {item.addedDate && (
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
              <span className="text-slate-400">Tanggal Terdaftar:</span>
              <span className="font-medium text-slate-700">{item.addedDate}</span>
            </div>
          )}

          {/* Catatan jika ada */}
          {item.notes && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catatan</span>
              <p className="text-xs text-slate-700 bg-amber-50/60 border border-amber-100 p-3 rounded-xl leading-relaxed">
                {item.notes}
              </p>
            </div>
          )}

          {/* Foto Barang jika ada */}
          {photoUrl && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Foto Barang</span>
              <div className="w-full h-56 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-2xs flex items-center justify-center">
                <img
                  src={photoUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Lock / Security Notice (No Menu, No Dashboard Access) */}
          <div className="pt-3 border-t border-slate-100 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span className="material-symbols-outlined text-[14px] text-slate-400">lock</span>
              Halaman Khusus Verifikasi Fisik Aset
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Data bersifat read-only. Tidak ada akses menu navigasi internal.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
