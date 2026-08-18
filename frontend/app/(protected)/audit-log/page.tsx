'use client';

import React, { useState } from 'react';

const ACTIVITY_CONFIG: Record<string, { icon: string; bg: string; text: string }> = {
  create: { icon: 'add_circle', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  update: { icon: 'edit', bg: 'bg-blue-50', text: 'text-blue-600' },
  approve: { icon: 'check_circle', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  reject: { icon: 'cancel', bg: 'bg-rose-50', text: 'text-rose-600' },
  delete: { icon: 'delete', bg: 'bg-rose-50', text: 'text-rose-600' },
  login: { icon: 'login', bg: 'bg-slate-100', text: 'text-slate-500' },
};

const LOGS = [
  { user: 'Ahmad Wijaya', action: 'approve', description: 'Menyetujui Fund Request #PD-001', timestamp: '2023-10-27 10:32:15' },
  { user: 'Dina Rahmawati', action: 'create', description: 'Membuat Fund Request baru #PD-001', timestamp: '2023-10-27 09:45:03' },
  { user: 'Budi Santoso', action: 'update', description: 'Mengubah invoice INV-2023-104', timestamp: '2023-10-27 08:12:41' },
  { user: 'Ahmad Wijaya', action: 'reject', description: 'Menolak Reimbursement #RB-2023-041', timestamp: '2023-10-26 16:20:09' },
  { user: 'Siti Nurhaliza', action: 'login', description: 'Login ke sistem', timestamp: '2023-10-26 08:01:22' },
  { user: 'Ahmad Wijaya', action: 'delete', description: 'Menghapus kategori transaksi "Legacy Category"', timestamp: '2023-10-25 14:55:37' },
  { user: 'Rina Wijaya', action: 'create', description: 'Mengajukan Reimbursement #RB-2023-041', timestamp: '2023-10-24 11:30:00' },
];

export default function AuditLogPage() {
  const [filterAction, setFilterAction] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = LOGS.filter((log) => filterAction === 'all' || log.action === filterAction);

  return (
    <div className="max-w-300 mx-auto space-y-6">

      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Audit Log</h2>
        <p className="text-sm text-slate-500 mt-1">Riwayat aktivitas pengguna dalam sistem</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-50">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nama user, deskripsi aktivitas..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>
        <div className="w-48">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipe Aktivitas</label>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none cursor-pointer"
          >
            <option value="all">Semua Aktivitas</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="approve">Approve</option>
            <option value="reject">Reject</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
          </select>
        </div>
        <div className="w-56">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tanggal</label>
          <input
            type="date"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
          />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.map((log, i) => {
            const config = ACTIVITY_CONFIG[log.action];
            return (
              <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center ${config.text} shrink-0`}>
                  <span className="material-symbols-outlined text-[18px]">{config.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">
                    <span className="font-semibold">{log.user}</span>{' '}
                    <span className="text-slate-600">{log.description}</span>
                  </p>
                  <p className="font-mono text-xs text-slate-400 mt-1">{log.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-slate-500 text-sm">
            Menampilkan {filtered.length} dari {LOGS.length} aktivitas
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

    </div>
  );
}