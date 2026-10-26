'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface RabItem {
  id: string;
  komponen: string;
  qty: number | string;
  satuan: string;
  freq: number | string;
  satuanFreq: string;
  biayaSatuan: number | string;
  total: number;
  keterangan: string;
  kodeKategori: string;
}

export default function NewFundRequestPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [applicantName, setApplicantName] = useState('');
  const [department, setDepartment] = useState('');
  const [programs, setPrograms] = useState<any[]>([]);
  const [purpose, setPurpose] = useState('');
  const [purposes, setPurposes] = useState<any[]>([]);
  const [rabCategories, setRabCategories] = useState<any[]>([]);
  const [neededDate, setNeededDate] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  // Tabel Komponen / RAB (Lengkap dengan Keterangan & ID Kode Kategori)
  const [items, setItems] = useState<RabItem[]>([
    {
      id: '1',
      komponen: '',
      qty: 1,
      satuan: '',
      freq: 1,
      satuanFreq: 'kali',
      biayaSatuan: '',
      total: 0,
      keterangan: '',
      kodeKategori: '',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Filter Keperluan khusus untuk Program yang dipilih
  const filteredPurposes = purposes.filter((p: any) => {
    if (!department) return true;
    if (!p.detail || p.detail === 'Semua Program' || p.detail === 'Umum') return true;
    return p.detail.trim().toLowerCase() === department.trim().toLowerCase();
  });

  const handleProgramChange = (selectedProg: string) => {
    setDepartment(selectedProg);
    const matching = purposes.filter((p: any) => {
      if (!p.detail || p.detail === 'Semua Program' || p.detail === 'Umum') return true;
      return p.detail.trim().toLowerCase() === selectedProg.trim().toLowerCase();
    });
    if (matching.length > 0) {
      setPurpose(matching[0].name);
    } else {
      setPurpose('');
    }
  };

  // Prefill applicant from localStorage & Fetch programs and purposes
  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) setApplicantName(savedName);

    const fetchDropdownData = async () => {
      let initialProg = '';

      // 1. Fetch Programs murni dari database
      try {
        const res = await api.get('/categories?type=programs&status=active');
        const data = res.data?.data || res.data;
        const progList = Array.isArray(data) ? data : [];
        setPrograms(progList);
        if (progList.length > 0) {
          initialProg = progList[0].name;
          setDepartment(initialProg);
        }
      } catch (err) {
        console.error('Gagal mengambil program dari database:', err);
        setPrograms([]);
      }

      // 2. Fetch Purposes murni dari database
      try {
        const res = await api.get('/categories?type=purposes&status=active');
        const data = res.data?.data || res.data;
        const purpList = Array.isArray(data) ? data : [];
        setPurposes(purpList);
        if (purpList.length > 0 && initialProg) {
          const matched = purpList.filter((p: any) => {
            if (!p.detail || p.detail === 'Semua Program' || p.detail === 'Umum') return true;
            return p.detail.trim().toLowerCase() === initialProg.trim().toLowerCase();
          });
          if (matched.length > 0) {
            setPurpose(matched[0].name);
          } else {
            setPurpose(purpList[0].name);
          }
        }
      } catch (err) {
        console.error('Gagal mengambil keperluan dari database:', err);
        setPurposes([]);
      }

      // 3. Fetch Kategori Transaksi / RAB murni dari database
      try {
        const res = await api.get('/categories?type=categories&status=active');
        const data = res.data?.data || res.data;
        const catList = Array.isArray(data) ? data : [];
        catList.sort((a: any, b: any) => {
          const numA = parseInt(a.code, 10);
          const numB = parseInt(b.code, 10);
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          return (a.code || '').localeCompare(b.code || '');
        });
        setRabCategories(catList);
      } catch (err) {
        console.error('Gagal mengambil kategori RAB dari database:', err);
        setRabCategories([]);
      }
    };

    fetchDropdownData();
  }, []);

  // Hitung perkalian row total: Qty * Freq * Biaya Satuan
  const calculateRowTotal = (qty: number | string, freq: number | string, biayaSatuan: number | string): number => {
    const q = typeof qty === 'string' ? parseFloat(qty.replace(/\D/g, '')) || 0 : qty || 0;
    const f = typeof freq === 'string' ? parseFloat(freq.replace(/\D/g, '')) || 0 : freq || 0;
    const b = typeof biayaSatuan === 'string' ? parseFloat(biayaSatuan.replace(/\D/g, '')) || 0 : biayaSatuan || 0;
    return q * f * b;
  };

  const handleItemChange = (index: number, field: keyof RabItem, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      let formattedValue = value;

      if (field === 'biayaSatuan') {
        const rawNum = value.replace(/\D/g, '');
        formattedValue = rawNum ? parseInt(rawNum, 10).toLocaleString('id-ID') : '';
      }

      const updated = { ...next[index], [field]: formattedValue };
      updated.total = calculateRowTotal(updated.qty, updated.freq, updated.biayaSatuan);
      next[index] = updated;
      return next;
    });
  };

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        komponen: '',
        qty: 1,
        satuan: '',
        freq: 1,
        satuanFreq: 'kali',
        biayaSatuan: '',
        total: 0,
        keterangan: '',
        kodeKategori: '',
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Grand Total Biaya
  const grandTotal = items.reduce((sum, item) => sum + (item.total || 0), 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 2 * 1024 * 1024) {
        setValidationError('Ukuran file maksimal 2MB');
        return;
      }
      setAttachment(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicantName || !department || !purpose || !neededDate) {
      setErrorMsg('Harap lengkapi informasi utama (Pemohon, Program, Keperluan, Tanggal)!');
      return;
    }

    if (grandTotal <= 0) {
      setErrorMsg('Total pengajuan tidak boleh Rp 0. Harap isi rincian komponen biaya dengan benar.');
      return;
    }

    const filledItems = items.filter(
      (item) => item.komponen.trim() !== '' || item.total > 0
    );

    if (filledItems.length === 0) {
      setErrorMsg('Minimal harus ada 1 komponen biaya yang diisi!');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      const cleanItems = filledItems.map((item, idx) => ({
        no: idx + 1,
        komponen: item.komponen,
        qty: typeof item.qty === 'string' ? parseFloat(item.qty) || 0 : item.qty,
        satuan: item.satuan,
        freq: typeof item.freq === 'string' ? parseFloat(item.freq) || 0 : item.freq,
        satuan_freq: item.satuanFreq,
        biaya_satuan: typeof item.biayaSatuan === 'string' ? parseInt(item.biayaSatuan.replace(/\D/g, '') || '0', 10) : item.biayaSatuan,
        total: item.total,
        keterangan: item.keterangan || '',
        kode_kategori: item.kodeKategori || '',
      }));

      const formData = new FormData();
      formData.append('purpose', purpose);
      formData.append('amount', grandTotal.toString());
      formData.append('need_date', neededDate);
      formData.append('applicant_name', applicantName);
      formData.append('department', department);
      formData.append('items', JSON.stringify(cleanItems));
      if (description) formData.append('description', description);
      if (attachment) formData.append('attachment', attachment);

      const res = await api.post('/fund-requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success || res.status === 200 || res.status === 201) {
        setShowSuccessModal(true);
        setTimeout(() => {
          router.push('/fund-requests');
        }, 1500);
      } else {
        throw new Error(res.data?.message || 'Gagal mengirimkan pengajuan dana ke server.');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Terjadi kesalahan sistem saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/fund-requests"
          className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pengajuan Dana Baru</h2>
          <p className="text-sm text-slate-500">Ajukan permintaan dana dan rincian anggaran biaya operasional</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-rose-600 text-[20px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-6">
        {/* Section 1: Informasi Utama */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="material-symbols-outlined text-primary text-[18px]">person</span>
            Informasi Pemohon
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Nama Pemohon <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Contoh: Bangkit / Koordinator Lapangan"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Program <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={department}
                onChange={(e) => handleProgramChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
              >
                <option value="" disabled>Pilih Program...</option>
                {programs.map((prog: any) => (
                  <option key={prog.id || prog.code || prog.name} value={prog.name}>
                    {prog.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Keperluan <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
              >
                {filteredPurposes.length === 0 ? (
                  <option value="" disabled>Belum ada keperluan terdaftar untuk program ini</option>
                ) : (
                  <>
                    <option value="" disabled>Pilih Keperluan...</option>
                    {filteredPurposes.map((purp: any) => (
                      <option key={purp.id || purp.code || purp.name} value={purp.name}>
                        {purp.code ? `[${purp.code}] ${purp.name}` : purp.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Tanggal Pengajuan <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={neededDate}
                onChange={(e) => setNeededDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Tabel Rincian Anggaran Biaya (RAB) */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">table_chart</span>
                Rincian Anggaran Biaya (RAB)
              </h3>
            </div>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Tambah Baris Komponen
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs border-collapse min-w-[980px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-2 w-8 text-center">No.</th>
                  <th className="py-3 px-3 min-w-[160px]">Komponen</th>
                  <th className="py-3 px-2 w-16 text-center">Qty</th>
                  <th className="py-3 px-2 w-24">Satuan</th>
                  <th className="py-3 px-2 w-16 text-center">Freq</th>
                  <th className="py-3 px-2 w-24">Satuan</th>
                  <th className="py-3 px-2.5 min-w-[120px] text-right">Biaya Satuan (Rp)</th>
                  <th className="py-3 px-2.5 min-w-[130px] text-right">Total Biaya (Rp)</th>
                  <th className="py-3 px-3 min-w-[170px]">Keterangan</th>
                  <th className="py-3 px-2.5 min-w-[160px]">ID (Kode Kategori)</th>
                  <th className="py-3 px-2 w-10 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-2 text-center text-slate-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.komponen}
                        onChange={(e) => handleItemChange(index, 'komponen', e.target.value)}
                        placeholder="Contoh: Sewa ruangan / Konsumsi"
                        className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                        placeholder="0"
                        className="w-full text-center bg-white border border-slate-200 rounded-md px-1.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-mono"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        value={item.satuan}
                        onChange={(e) => handleItemChange(index, 'satuan', e.target.value)}
                        placeholder="unit, orang"
                        className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.freq}
                        onChange={(e) => handleItemChange(index, 'freq', e.target.value)}
                        placeholder="1"
                        className="w-full text-center bg-white border border-slate-200 rounded-md px-1.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-mono"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        value={item.satuanFreq}
                        onChange={(e) => handleItemChange(index, 'satuanFreq', e.target.value)}
                        placeholder="kali, desa"
                        className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
                      />
                    </td>
                    <td className="py-2.5 px-2.5">
                      <input
                        type="text"
                        value={item.biayaSatuan}
                        onChange={(e) => handleItemChange(index, 'biayaSatuan', e.target.value)}
                        placeholder="0"
                        className="w-full text-right bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-mono placeholder:text-slate-400"
                      />
                    </td>
                    <td className="py-2.5 px-2.5 text-right">
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        Rp {item.total.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={item.keterangan}
                        onChange={(e) => handleItemChange(index, 'keterangan', e.target.value)}
                        placeholder="Contoh: biaya sewa & kebersihan"
                        className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
                      />
                    </td>
                    <td className="py-2.5 px-2.5">
                      <select
                        value={item.kodeKategori}
                        onChange={(e) => handleItemChange(index, 'kodeKategori', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs cursor-pointer font-mono"
                      >
                        <option value="">Pilih ID / Kategori...</option>
                        {rabCategories.map((k: any) => (
                          <option key={k.id || k.code || k.name} value={k.code}>
                            {k.code} - {k.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        disabled={items.length <= 1}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Hapus baris"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/80 border-t-2 border-slate-200">
                <tr>
                  <td colSpan={7} className="py-3 px-4 text-right font-bold text-slate-700 uppercase tracking-wider text-xs">
                    Total Biaya Komponen:
                  </td>
                  <td className="py-3 px-2.5 text-right">
                    <span className="font-mono font-bold text-primary text-sm">
                      Rp {grandTotal.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Reference Card: Kode Kategori (Sesuai Format Excel) */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
            <span className="font-bold text-slate-700 block mb-1.5">Kode Kategori (Sesuai Excel):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-[11px]">
              {rabCategories.map((k: any) => (
                <div key={k.id || k.code || k.name} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 font-bold font-mono flex items-center justify-center text-[10px] shrink-0">
                    {k.code || k.id}
                  </span>
                  <span className="truncate text-slate-700 font-medium">{k.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Jumlah Pengajuan (Ditaruh di Paling Bawah) */}
        <div className="bg-linear-to-r from-red-50/60 to-rose-50/30 border border-red-200/80 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-red-900/80 uppercase tracking-wider block">
              JUMLAH PENGAJUAN (TOTAL RP)
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Otomatis dihitung dari akumulasi Total Biaya seluruh komponen RAB di atas
            </p>
          </div>
          <div className="text-right sm:text-right w-full sm:w-auto">
            <span className="text-2xl sm:text-3xl font-extrabold text-primary font-mono block">
              Rp {grandTotal.toLocaleString('id-ID')}
            </span>
            {grandTotal === 0 && (
              <span className="text-[11px] text-amber-600 font-medium">
                * Belum ada biaya yang diinput
              </span>
            )}
          </div>
        </div>

        {/* Section 4: Keterangan Tambahan & Lampiran */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Penjelasan / Catatan Keperluan (Opsional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail latar belakang kegiatan, kerangka acuan kegiatan (KAK), atau keterangan penting lainnya..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none h-24 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Lampiran Pendukung / Berkas KAK (Opsional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".png,.jpg,.jpeg,.pdf"
            />
            {attachment ? (
              <div className="relative border border-slate-200 rounded-lg p-3 flex items-center gap-4 bg-slate-50">
                {attachment.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(attachment)} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                ) : (
                  <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-lg border border-slate-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px]">picture_as_pdf</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{attachment.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(attachment.size / 1024 / 1024).toFixed(2)} MB • Siap diupload</p>
                </div>
                <button 
                  type="button"
                  onClick={() => { setAttachment(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer bg-slate-50/50"
              >
                <span className="material-symbols-outlined text-slate-400 text-[26px]">attachment</span>
                <p className="text-sm text-slate-600 font-medium">Klik untuk upload berkas lampiran pendukung</p>
                <p className="text-xs text-slate-400">PNG, JPG, PDF maksimal 2MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0 mt-0.5">info</span>
          <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
            Pengajuan dana RAB ini akan tercatat dengan status <span className="font-semibold">Pending Approval</span> dan memerlukan verifikasi serta persetujuan dari Pengelola Dana / Finance Admin.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/fund-requests"
            className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:brightness-110 transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Mengirim...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">send</span>
                Ajukan Dana
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Sukses */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Berhasil Diajukan!</h3>
            <p className="text-slate-500 text-sm mb-6">Pengajuan dana beserta rincian RAB berhasil dibuat.</p>
          </div>
        </div>
      )}

      {/* Validation / Error Modal */}
      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pemberitahuan</h3>
            <p className="text-slate-500 text-sm mb-6">{validationError}</p>
            <button
              onClick={() => setValidationError('')}
              className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:brightness-110 transition-colors cursor-pointer"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
