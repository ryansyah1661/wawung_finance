'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DetailSkeleton from '@/components/ui/DetailSkeleton';
import KawungQrCode from '@/components/KawungQrCode';
import api from '@/lib/api';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  baik: { label: 'Baik', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  available: { label: 'Baik', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'tidak-rusak': { label: 'Baik', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'low-stock': { label: 'Baik', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'rusak-ringan': { label: 'Rusak Ringan', bg: 'bg-amber-50', text: 'text-amber-700' },
  'rusak-berat': { label: 'Rusak Berat', bg: 'bg-rose-50', text: 'text-rose-700' },
  rusak: { label: 'Rusak Berat', bg: 'bg-rose-50', text: 'text-rose-700' },
  damaged: { label: 'Rusak Berat', bg: 'bg-rose-50', text: 'text-rose-700' },
  'out-of-stock': { label: 'Rusak Berat', bg: 'bg-rose-50', text: 'text-rose-700' },
};

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function InventoryDetailPage() {
  const params = useParams();
  const code = decodeURIComponent(params.code as string); // In case of %20 spaces etc.
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/inventory/${code}`)
      .then(res => {
        setItem(res.data);
      })
      .catch(err => {
        console.error(err);
        setItem(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code]);

  if (loading) {
    return (
      <div className="p-8">
        <DetailSkeleton maxWidth="max-w-[1200px]" />
      </div>
    );
  }

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

  const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.baik;
  const condLabel = status.label;
  const condDotClass = item.status === 'rusak-ringan' ? 'bg-amber-500' : (item.status === 'rusak-berat' || item.status === 'rusak' || item.status === 'damaged') ? 'bg-rose-500' : 'bg-emerald-500';
  const condTextClass = item.status === 'rusak-ringan' ? 'text-amber-700' : (item.status === 'rusak-berat' || item.status === 'rusak' || item.status === 'damaged') ? 'text-rose-700' : 'text-emerald-700';
  const detailUrl = typeof window !== 'undefined' ? `${window.location.origin}/scan/${item.code}` : '';
  const photoUrl = item.photo ? (item.photo.includes('/storage/') ? '/storage/' + item.photo.split('/storage/')[1] : item.photo) : null;

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
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center">
          <KawungQrCode
            value={detailUrl}
            size={180}
            downloadFileName={`qr-${item.code}.png`}
            showDownloadButton={true}
          />
        </div>

        {/* Info Card */}
        <div className="sm:col-span-2 bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Informasi Barang</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kategori</p>
              <p className="text-sm text-slate-900">{item.category}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kondisi</p>
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${condDotClass}`} />
                <span className={condTextClass}>
                  {condLabel}
                </span>
              </p>
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

          {photoUrl && (
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Foto Barang</p>
              <img src={photoUrl} alt={item.name} className="mt-2 w-48 h-48 object-cover rounded-xl border border-slate-200 shadow-sm" />
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
