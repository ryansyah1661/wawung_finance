'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TableSkeleton from '@/components/ui/TableSkeleton';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700' },
  approved: { label: 'Approved', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  rejected: { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-700' },
};

function formatRupiah(amount: number | string | undefined | null) {
  if (amount === undefined || amount === null || amount === '') return 'Rp 0';
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount)) || 0;
  return `Rp ${Math.round(num).toLocaleString('id-ID')}`;
}

export default function ReimbursementsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');

  const [requests, setRequests] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | number; requestId: string }>({
    show: false,
    id: '',
    requestId: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [infoModal, setInfoModal] = useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: '',
    message: '',
  });

  // Fetch Data dari API Database Laravel
  const fetchReimbursements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [res, deptRes] = await Promise.all([
        fetch('/api/reimbursements'),
        fetch('/api/categories?type=programs&status=active')
      ]);
      
      if (!res.ok) throw new Error('Gagal mengambil data dari server');

      const result = await res.json();
      // Menangani format response { success: true, data: [...] }
      const listData = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
      setRequests(listData);

      if (deptRes.ok) {
        const deptData = await deptRes.json();
        setDepartments(deptData.data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat data');
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReimbursements();
  }, []);

  // Handle Hapus Data ke API
  const handleDelete = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setDeleteModal({
      show: true,
      id: item.id,
      requestId: item.request_id || `#${item.id}`,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/reimbursements/${deleteModal.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Gagal menghapus data');

      setRequests((prev) => prev.filter((r) => r.id !== deleteModal.id));
      setDeleteModal({ show: false, id: '', requestId: '' });
    } catch (err: any) {
      setDeleteModal({ show: false, id: '', requestId: '' });
      setInfoModal({
        show: true,
        title: 'Gagal Menghapus',
        message: err.message || 'Gagal menghapus data dari server.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    import('xlsx').then(XLSX => {
      const worksheet = XLSX.utils.json_to_sheet(requests.map(r => ({
        ID: r.request_id || `#${r.id}`,
        Date: r.date || '',
        Employee: r.user_name || r.employee || r.requester || '',
        Program: r.department || '',
        Description: r.description || '',
        Amount: r.amount || 0,
        Status: r.status || 'Pending'
      })));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reimbursements");
      XLSX.writeFile(workbook, "reimbursements.xlsx");
    });
  };

  // Filter Data dengan proteksi Array & pemetaan field DB Laravel
  const safeRequests = Array.isArray(requests) ? requests : [];

  const filteredRequests = safeRequests.filter(r => {
    const searchLow = searchQuery.toLowerCase();
    const desc = (r.description || '').toLowerCase();
    const userName = (r.user_name || r.employee || r.requester || '').toLowerCase();
    const reqId = (r.request_id || r.id || '').toString().toLowerCase();

    const matchesSearch = desc.includes(searchLow) || userName.includes(searchLow) || reqId.includes(searchLow);
    const matchesStatus = statusFilter === 'All Status' || (r.status || 'Pending').toLowerCase() === statusFilter.toLowerCase();
    const matchesDept = departmentFilter === 'All Departments' || (r.department || '').toLowerCase() === departmentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesDept;
  });

  const pendingCount = safeRequests.filter(r => !r.status || r.status.toLowerCase() === 'pending').length;
  const rejectedCount = safeRequests.filter(r => r.status?.toLowerCase() === 'rejected').length;
  const approvedAmount = safeRequests
    .filter(r => r.status?.toLowerCase() === 'approved')
    .reduce((sum, r) => {
      const amt = typeof r.amount === 'number' ? r.amount : parseFloat(String(r.amount)) || 0;
      return sum + amt;
    }, 0);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reimbursements</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola pengajuan penggantian biaya karyawan</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            Cetak Laporan
          </button>
          <Link href="/reimbursements/new-reimbursement" className="bg-primary text-white hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Ajukan Reimburse
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pending</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{pendingCount} <span className="text-xs font-normal text-slate-500">items</span></p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-[20px]">pending_actions</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Approved (Total)</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{formatRupiah(approvedAmount)}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rejected</p>
            <p className="text-xl font-bold text-slate-900 font-mono">{rejectedCount} <span className="text-xs font-normal text-slate-500">items</span></p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <span className="material-symbols-outlined text-[20px]">cancel</span>
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
            placeholder="Nama karyawan, ID, deskripsi..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>
        <div className="w-44">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
          >
            <option value="All Status">Semua Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Program</label>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
          >
            <option value="All Departments">Semua Program</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3">ID</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Pemohon</th>
                <th className="p-3">Program</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3 text-right">Jumlah</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {isLoading ? (
                <TableSkeleton columns={8} />
              ) : error ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-rose-500">
                    {error}
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500">
                    Tidak ada data reimbursement.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((item) => {
                  const statusKey = (item.status || 'pending').toLowerCase();
                  const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
                  const displayId = item.request_id || `#${item.id}`;
                  const empName = item.user_name || item.employee || item.requester || 'User';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => router.push(`/reimbursements/${item.id}`)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="p-3 font-mono text-xs font-medium text-slate-900">{displayId}</td>
                      <td className="p-3 text-slate-500">{item.date || '-'}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px]">
                            {empName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-medium text-slate-900">{empName}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-500">{item.department || '-'}</td>
                      <td className="p-3 text-slate-700 max-w-70 truncate">{item.description || '-'}</td>
                      <td className="p-3 text-right font-mono font-medium text-slate-900">{formatRupiah(item.amount)}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-3 text-center flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                        </button>
                        <button className="text-slate-400 group-hover:text-primary transition-colors cursor-pointer">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                        </button>
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
            Menampilkan {filteredRequests.length} data
          </span>
          <div className="flex gap-1">
            <button className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer" disabled>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
            </button>
            <button className="px-3 py-1 rounded bg-primary/10 text-primary font-medium text-sm cursor-pointer">1</button>
            <button className="p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>
      {/* Confirm Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">delete_forever</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hapus Reimbursement?</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Apakah Anda yakin ingin menghapus data reimbursement <strong className="text-slate-700">{deleteModal.requestId}</strong>? Data yang sudah dihapus tidak dapat dikembalikan.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ show: false, id: '', requestId: '' })}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info/Error Modal */}
      {infoModal.show && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">warning</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{infoModal.title}</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">{infoModal.message}</p>
              <button
                type="button"
                onClick={() => setInfoModal({ show: false, message: '', title: '' })}
                className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl hover:brightness-110 transition-colors cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}