'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

type TabKey = 'accounts' | 'categories' | 'departments' | 'vendors';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'accounts', label: 'Akun Bank/Kas', icon: 'account_balance' },
  { key: 'categories', label: 'Kategori Transaksi', icon: 'category' },
  { key: 'departments', label: 'Departemen', icon: 'apartment' },
  { key: 'vendors', label: 'Vendor/Klien', icon: 'storefront' },
];

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('categories');
  const [masterData, setMasterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: '', detail: '', status: 'active' as 'active' | 'inactive' });

  // UX Modals
  const [infoModal, setInfoModal] = useState({ show: false, message: '', title: 'Informasi', type: 'info' as 'info' | 'success' | 'warning' });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchMasterData = async () => {
    setLoading(true);
    try {
      // Panggil endpoint categories menggunakan parameter type
      const res = await api.get(`/categories?type=${activeTab}`);
      const responseData = res.data?.data || res.data;

      setMasterData(Array.isArray(responseData) ? responseData : []);
    } catch (err) {
      console.error(err);
      setMasterData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, [activeTab]);

  const handleDelete = (id: number) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/${activeTab}/${deleteConfirm}`);
      fetchMasterData();
      setDeleteConfirm(null);
      setInfoModal({ show: true, title: 'Berhasil', message: 'Data berhasil dihapus!', type: 'success' });
    } catch (err) {
      setInfoModal({ show: true, title: 'Error', message: 'Gagal menghapus data.', type: 'warning' });
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', detail: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name || item.nama || '',
      detail: item.detail || item.code || item.keterangan || '',
      status: item.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        code: formData.detail || `MD-${Date.now()}`,
        detail: formData.detail,
        type: activeTab,
        status: formData.status
      };

      if (editingItem) {
        await api.put(`/categories/${editingItem.id}`, payload);
      } else {
        await api.post('/categories', payload);
      }

      fetchMasterData();
      setIsModalOpen(false);
      setInfoModal({ show: true, title: 'Berhasil', message: editingItem ? 'Data berhasil diupdate!' : 'Data baru berhasil ditambahkan!', type: 'success' });
    } catch (err) {
      setInfoModal({ show: true, title: 'Error', message: 'Gagal menyimpan data ke server.', type: 'warning' });
    }
  };

  // Guarding aman menggunakan Array.isArray agar tidak pernah melempar TypeError
  const items = Array.isArray(masterData) ? masterData : [];

  return (
    <div className="max-w-300 mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Master Data</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola data referensi yang dipakai di seluruh aplikasi</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-primary text-white hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm">
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === tab.key
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
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Memuat data...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Belum ada data di kategori ini.</td></tr>
              ) : items.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-3 font-medium text-slate-900">{item.name || item.nama}</td>
                  <td className="p-3 text-slate-500">{item.detail || item.code || item.keterangan || '-'}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${(item.status || 'active') === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                        }`}
                    >
                      {(item.status || 'active') === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Edit">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Hapus">
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {editingItem ? 'Edit Data' : 'Tambah Data Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  placeholder="Masukkan nama..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detail / Keterangan</label>
                <input
                  type="text"
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  placeholder="Detail keterangan..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary text-white hover:brightness-110 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info/Success Modal */}
      {infoModal.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${infoModal.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
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
                  className={`w-full py-2.5 px-4 rounded-xl text-white font-semibold shadow-sm transition-colors cursor-pointer ${infoModal.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' :
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

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">delete_forever</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Konfirmasi Hapus</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus data ini?
                Data yang dihapus tidak dapat dikembalikan.
              </p>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-rose-600 text-white hover:bg-rose-700 rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer flex justify-center items-center gap-2"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}