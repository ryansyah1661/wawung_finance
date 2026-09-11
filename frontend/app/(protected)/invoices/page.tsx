'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface InvoiceItem {
  id?: string;
  description: string;
  qty: number;
  price: number;
}

interface Invoice {
  id: string;
  invoice_number?: string;
  client_name?: string;
  issue_date?: string;
  due_date?: string;
  amount: number;
  status: string;
  notes?: string;
  items?: InvoiceItem[];
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  overdue: { label: 'Terlambat', bg: 'bg-rose-50', text: 'text-rose-700' },
  'due-soon': { label: 'Segera Jatuh Tempo', bg: 'bg-amber-50', text: 'text-amber-700' },
  paid: { label: 'Lunas', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  draft: { label: 'Draf', bg: 'bg-slate-100', text: 'text-slate-600' },
};

function formatRupiah(amount: number) {
  return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('');

  const [infoModal, setInfoModal] = useState({ show: false, message: '', title: '' });
  const [confirmModal, setConfirmModal] = useState({ show: false, id: '' });

  // Fetch Invoices dari Backend API
  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/invoices');
      if (!res.ok) throw new Error('Gagal mengambil data invoice');
      const data = await res.json();

      // Memastikan tipe data yang masuk ke state selalu berupa Array
      if (Array.isArray(data)) {
        setInvoices(data);
      } else if (data && Array.isArray(data.data)) {
        setInvoices(data.data);
      } else {
        setInvoices([]);
      }
    } catch (err: any) {
      setInvoices([]);
      setInfoModal({
        show: true,
        title: 'Error',
        message: err.message || 'Terjadi kesalahan saat memuat data.',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleDelete = (id: string) => {
    setConfirmModal({ show: true, id });
  };

  const confirmDelete = async () => {
    if (!confirmModal.id) return;
    try {
      const res = await fetch(`/api/invoices/${confirmModal.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Gagal menghapus invoice');

      setInvoices((prev) => (Array.isArray(prev) ? prev.filter((i) => i.id !== confirmModal.id) : []));
      setConfirmModal({ show: false, id: '' });
    } catch (err: any) {
      setConfirmModal({ show: false, id: '' });
      setInfoModal({
        show: true,
        title: 'Gagal Hapus',
        message: err.message || 'Gagal menghapus data dari server.',
      });
    }
  };

  // Pengecekan aman untuk variabel invoices
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const filteredInvoices = safeInvoices.filter((inv) => {
    const matchSearch =
      inv.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    const mappedStatus = STATUS_CONFIG[inv.status]?.label || 'Draf';
    const matchStatus = statusFilter === 'All Status' || mappedStatus === statusFilter;
    const matchDate = dateFilter === '' || inv.due_date === dateFilter;
    return matchSearch && matchStatus && matchDate;
  });

  const handleExport = () => {
    import('xlsx').then((XLSX) => {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredInvoices.map((e: Invoice) => ({
          'No. Invoice': e.invoice_number || e.id,
          Client: e.client_name,
          'Tanggal Terbit': e.issue_date,
          'Jatuh Tempo': e.due_date,
          Jumlah: e.amount,
          Status: STATUS_CONFIG[e.status]?.label || e.status,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
      XLSX.writeFile(workbook, 'invoices.xlsx');
    });
  };

  const totalOutstanding = safeInvoices
    .filter((i) => i.status === 'overdue' || i.status === 'due-soon')
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const totalPaid = safeInvoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + Number(i.amount || 0), 0);

  const countOverdue = safeInvoices.filter((i) => i.status === 'overdue').length;
  const countDueSoon = safeInvoices.filter((i) => i.status === 'due-soon').length;

  const formatShortRupiah = (amount: number) => {
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(1)}K`;
    return formatRupiah(amount);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invoices</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola tagihan dan pembayaran klien</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              download
            </span>
            Export
          </button>
          <Link href="/invoices/new-invoice">
            <button className="bg-primary text-white hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                add
              </span>
              Create Invoice
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Outstanding
            </p>
            <p className="text-lg font-bold text-slate-900 font-mono">
              {formatShortRupiah(totalOutstanding)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Terlambat
            </p>
            <p className="text-lg font-bold text-slate-900 font-mono">
              {countOverdue} <span className="text-xs font-normal text-slate-500">invoice</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <span className="material-symbols-outlined text-[20px]">event_busy</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Segera Jatuh Tempo
            </p>
            <p className="text-lg font-bold text-slate-900 font-mono">
              {countDueSoon} <span className="text-xs font-normal text-slate-500">invoice</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-[20px]">schedule</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Lunas (Bulan Ini)
            </p>
            <p className="text-lg font-bold text-slate-900 font-mono">{formatShortRupiah(totalPaid)}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-50">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Search
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Client, ID invoice..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>
        <div className="w-44">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
          >
            <option>Semua Status</option>
            <option>Draf</option>
            <option>Segera Jatuh Tempo</option>
            <option>Terlambat</option>
            <option>Lunas</option>
          </select>
        </div>
        <div className="w-56">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Due Date Range
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3">No. Invoice</th>
                <th className="p-3">Client</th>
                <th className="p-3">Tanggal Terbit</th>
                <th className="p-3">Jatuh Tempo</th>
                <th className="p-3 text-right">Jumlah</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Memuat data invoice...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Tidak ada invoice ditemukan.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => {
                  const status = STATUS_CONFIG[invoice.status] || STATUS_CONFIG['draft'];
                  return (
                    <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-3 font-mono text-xs font-medium text-slate-900">
                        {invoice.invoice_number || invoice.id}
                      </td>
                      <td className="p-3 font-medium text-slate-900">{invoice.client_name}</td>
                      <td className="p-3 text-slate-500">{invoice.issue_date}</td>
                      <td className="p-3 text-slate-500">{invoice.due_date}</td>
                      <td className="p-3 text-right font-mono font-medium text-slate-900">
                        {formatRupiah(invoice.amount)}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${status.bg} ${status.text}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => router.push(`/invoices/${invoice.id}`)}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="View"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                              visibility
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              const htmlContent = `
                                <html>
                                  <head><title>Invoice ${invoice.invoice_number || invoice.id}</title></head>
                                  <body style="font-family: sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
                                    <h1>INVOICE ${invoice.invoice_number || invoice.id}</h1>
                                    <hr/>
                                    <p><strong>Client:</strong> ${invoice.client_name}</p>
                                    <p><strong>Tanggal Terbit:</strong> ${invoice.issue_date}</p>
                                    <p><strong>Jatuh Tempo:</strong> ${invoice.due_date}</p>
                                    <p><strong>Total:</strong> Rp ${Number(invoice.amount || 0).toLocaleString('id-ID')}</p>
                                    <br/>
                                    <p><em>Dokumen ini di-generate otomatis oleh Wawung Finance.</em></p>
                                  </body>
                                </html>
                              `;
                              const blob = new Blob([htmlContent], { type: 'text/html' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `${invoice.id}.html`;
                              link.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Download"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                              download
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(invoice.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-slate-500 text-sm">
            Menampilkan {filteredInvoices.length} invoice
          </span>
          <div className="flex gap-1">
            <button
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
              disabled
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                chevron_left
              </span>
            </button>
            <button className="px-3 py-1 rounded bg-primary/10 text-primary font-medium text-sm cursor-pointer">
              1
            </button>
            <button className="p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {infoModal.show && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">info</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{infoModal.title}</h3>
              <p className="text-slate-500 mb-6">{infoModal.message}</p>
              <button
                onClick={() => setInfoModal({ show: false, message: '', title: '' })}
                className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:brightness-110 transition-colors cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">delete_forever</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Invoice?</h3>
              <p className="text-slate-500 mb-6">
                Apakah Anda yakin ingin menghapus invoice <strong>{confirmModal.id}</strong>? Data yang sudah dihapus tidak bisa dikembalikan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal({ show: false, id: '' })}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:brightness-110 transition-colors cursor-pointer"
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