'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function NewInventoryItemPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [photo, setPhoto] = useState<{name: string, dataUrl: string, file?: File} | null>(null);
  const [availableCategories, setAvailableCategories] = useState<{name: string}[]>([]);
  const [infoModal, setInfoModal] = useState({ show: false, message: '', title: '', type: 'success' as 'success' | 'warning' | 'info' });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [addedDate, setAddedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !location || !qty || !value) {
      setInfoModal({ show: true, title: 'Validasi Gagal', message: 'Harap lengkapi semua field yang wajib diisi (*).', type: 'warning' });
      return;
    }

    let newStatus = 'available';
    if (parseInt(qty) === 0) newStatus = 'out-of-stock';
    else if (parseInt(qty) <= 5) newStatus = 'low-stock';

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('location', location);
      formData.append('qty', qty.toString());
      formData.append('unit', unit || '-');
      formData.append('status', newStatus);
      formData.append('value', value.replace(/\D/g, '') || '0');
      formData.append('notes', notes);
      formData.append('addedDate', addedDate);
      
      if (photo?.file) {
        formData.append('photo', photo.file);
      }

      const res = await api.post('/inventory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSavedCode(res.data.code);
    } catch (e: any) {
      setInfoModal({ show: true, title: 'Error', message: 'Terjadi kesalahan saat menyimpan data ke server.', type: 'warning' });
    }
  };

  useEffect(() => {
    // Fetch categories from API
    api.get('/categories')
      .then(res => {
        const cats = res.data.filter((c: any) => c.status === 'active' && c.type === 'categories');
        if (cats.length > 0) setAvailableCategories(cats);
        else setAvailableCategories([{name: 'Elektronik'}, {name: 'Furniture'}, {name: 'ATK'}]);
      })
      .catch(err => {
        console.error(err);
        setAvailableCategories([{name: 'Elektronik'}, {name: 'Furniture'}, {name: 'ATK'}]);
      });
  }, []);

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
          <div className="flex flex-col gap-3 w-full">
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
            <button
              onClick={() => router.push('/inventory')}
              className="w-full px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Kembali ke Daftar Inventaris
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
            >
              <option value="">Pilih kategori...</option>
              {availableCategories.map((cat, idx) => (
                <option key={idx} value={cat.name}>{cat.name}</option>
              ))}
              <option value="Lainnya">Lainnya</option>
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
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Terdaftar</label>
            <input
              type="date"
              value={addedDate}
              onChange={(e) => setAddedDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
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
              type="text"
              value={value}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, '');
                setValue(rawValue ? parseInt(rawValue, 10).toLocaleString('id-ID') : '');
              }}
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
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 5 * 1024 * 1024) {
                setInfoModal({ show: true, title: 'File Terlalu Besar', message: 'Ukuran file maksimal yang diperbolehkan adalah 5MB.', type: 'warning' });
                return;
              }
              const reader = new FileReader();
              reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  let width = img.width;
                  let height = img.height;
                  const MAX_SIZE = 800;
                  
                  if (width > height && width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                  } else if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                  }
                  
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    setPhoto({ name: file.name, dataUrl: compressedDataUrl, file: file });
                  } else {
                    setPhoto({ name: file.name, dataUrl: ev.target?.result as string, file: file });
                  }
                };
                img.src = ev.target?.result as string;
              };
              reader.readAsDataURL(file);
            }}
          />
          {photo ? (
            <div className="relative border border-slate-200 rounded-lg p-3 flex items-center gap-4 bg-slate-50">
              <img src={photo.dataUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-slate-200" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">{photo.name}</p>
                <p className="text-xs text-slate-500 mt-1">Foto siap disimpan</p>
              </div>
              <button 
                type="button"
                onClick={() => { setPhoto(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-slate-400 text-[28px]">add_a_photo</span>
              <p className="text-sm text-slate-500">Klik untuk upload foto</p>
              <p className="text-xs text-slate-400">PNG, JPG maksimal 5MB</p>
            </div>
          )}
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

      {/* Info/Warning Modal */}
      {infoModal.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                infoModal.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                infoModal.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <span className="material-symbols-outlined text-3xl">
                  {infoModal.type === 'success' ? 'check_circle' : infoModal.type === 'warning' ? 'warning' : 'info'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{infoModal.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{infoModal.message}</p>
              <div className="pt-2">
                <button 
                  onClick={() => setInfoModal({ ...infoModal, show: false })}
                  className={`w-full py-2.5 px-4 rounded-xl text-white font-semibold shadow-sm transition-colors cursor-pointer ${
                    infoModal.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' :
                    infoModal.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
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