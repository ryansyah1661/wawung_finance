'use client';

import React, { useState, useEffect } from 'react';
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

import api from '@/lib/api';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [availableCategories, setAvailableCategories] = useState<{name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [infoModal, setInfoModal] = useState({ show: false, message: '', title: '', type: 'success' as 'success' | 'warning' | 'info' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, catRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/categories')
      ]);
      setInventory(invRes.data);
      const activeCats = catRes.data.filter((c: any) => c.status === 'active' && c.type === 'categories');
      setAvailableCategories(activeCats.length > 0 ? activeCats : [{ name: 'Elektronik' }, { name: 'Furniture' }, { name: 'ATK' }]);
    } catch (err) {
      console.error(err);
      setInfoModal({ show: true, title: 'Error', message: 'Gagal memuat data dari server.', type: 'warning' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (code: string) => {
    setDeleteConfirm(code);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/inventory/${deleteConfirm}`);
      fetchData();
      setDeleteConfirm(null);
      setInfoModal({ show: true, title: 'Berhasil', message: 'Barang berhasil dihapus!', type: 'success' });
    } catch (err) {
      setInfoModal({ show: true, title: 'Error', message: 'Gagal menghapus data.', type: 'warning' });
    }
  };

  const handleOpenEdit = (item: any) => {
    setEditData({ ...item });
    setEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    try {
      // Auto-determine status based on qty
      let newStatus = 'available';
      if (editData.qty === 0) newStatus = 'out-of-stock';
      else if (editData.qty <= 5) newStatus = 'low-stock';
      
      const payload = { ...editData, status: newStatus };
      
      await api.put(`/inventory/${editData.code}`, payload);
      fetchData();
      setEditModal(false);
      setInfoModal({ show: true, title: 'Berhasil', message: `Data barang ${editData.name} berhasil diupdate!`, type: 'success' });
    } catch (err) {
      setInfoModal({ show: true, title: 'Error', message: 'Gagal update data barang.', type: 'warning' });
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === 'Semua Kategori' || item.category === categoryFilter;
    const mappedStatus = STATUS_CONFIG[item.status]?.label || item.status;
    const matchStatus = statusFilter === 'Semua Status' || mappedStatus === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const handleExport = () => {
    import('xlsx').then(XLSX => {
      const worksheet = XLSX.utils.json_to_sheet(filteredInventory.map((e: any) => ({
        Kode: e.code,
        'Nama Barang': e.name,
        Kategori: e.category,
        Lokasi: e.location,
        Stok: `${e.qty} ${e.unit}`,
        'Nilai/Unit': e.value,
        Status: STATUS_CONFIG[e.status]?.label || e.status
      })));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
      XLSX.writeFile(workbook, "inventory.xlsx");
    });
  };

  const totalValue = filteredInventory.reduce((sum, item) => sum + item.qty * item.value, 0);
  const lowStockCount = filteredInventory.filter((i) => i.status === 'low-stock').length;
  const outOfStockCount = filteredInventory.filter((i) => i.status === 'out-of-stock').length;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventaris</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola aset dan stok barang perusahaan</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            Export
          </button>
          <Link href="/inventory/new-inventory" className="bg-primary text-white hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Tambah Barang
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Item</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{filteredInventory.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Nilai Aset</p>
            <p className="text-lg font-bold text-slate-900 font-mono">{formatRupiah(totalValue)}</p>
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
        <div className="flex-1 min-w-[200px]">
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
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer">
            <option>Semua Kategori</option>
            {availableCategories.map((cat, idx) => (
              <option key={idx} value={cat.name}>{cat.name}</option>
            ))}
            <option>Lainnya</option>
          </select>
        </div>
        <div className="w-44">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer">
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
                <th className="p-3 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Tidak ada barang ditemukan.
                  </td>
                </tr>
              ) : filteredInventory.map((item) => {
                const status = STATUS_CONFIG[item.status] || STATUS_CONFIG['available'];
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
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/inventory/${item.code}`}
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Lihat QR & Detail"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>qr_code_2</span>
                        </Link>
                        <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Edit">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                        </button>
                        <button onClick={() => handleDelete(item.code)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" title="Hapus">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
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

      {/* Edit Modal */}
      {editModal && editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Edit Barang</h3>
              <button onClick={() => setEditModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kode</label>
                  <input type="text" value={editData.code} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-500 text-sm cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
                  <select value={editData.category} onChange={(e) => setEditData({...editData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm">
                    <option>Elektronik</option>
                    <option>Furniture</option>
                    <option>ATK</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Barang</label>
                <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Lokasi</label>
                <input type="text" value={editData.location} onChange={(e) => setEditData({...editData, location: e.target.value})} required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stok</label>
                  <input type="number" min="0" value={editData.qty} onChange={(e) => setEditData({...editData, qty: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Satuan</label>
                  <input type="text" value={editData.unit} onChange={(e) => setEditData({...editData, unit: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nilai/Unit (Rp)</label>
                  <input type="number" min="0" value={editData.value} onChange={(e) => setEditData({...editData, value: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors cursor-pointer">
                  Batal
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-white hover:brightness-110 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">delete_forever</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Konfirmasi Hapus</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus barang <strong className="text-slate-700">{deleteConfirm}</strong>? Data yang dihapus tidak dapat dikembalikan.
              </p>
              <div className="pt-4 flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors cursor-pointer">
                  Batal
                </button>
                <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-rose-600 text-white hover:bg-rose-700 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer">
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info/Success Modal */}
      {infoModal.show && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
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