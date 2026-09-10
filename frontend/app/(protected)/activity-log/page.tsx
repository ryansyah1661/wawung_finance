'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface LogItem {
  id: number;
  user_name: string;
  action: 'create' | 'update' | 'approve' | 'reject' | 'delete' | 'login';
  description: string;
  created_at: string;
}

const ACTIVITY_CONFIG: Record<string, { icon: string; bg: string; text: string }> = {
  create: { icon: 'add_circle', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  update: { icon: 'edit', bg: 'bg-blue-50', text: 'text-blue-600' },
  approve: { icon: 'check_circle', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  reject: { icon: 'cancel', bg: 'bg-rose-50', text: 'text-rose-600' },
  delete: { icon: 'delete', bg: 'bg-rose-50', text: 'text-rose-600' },
  login: { icon: 'login', bg: 'bg-slate-100', text: 'text-slate-500' },
};

export default function ActivityLogPage() {
  const [filterAction, setFilterAction] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalLogs, setTotalLogs] = useState(0);

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterAction !== 'all') params.append('action', filterAction);
      if (searchQuery) params.append('search', searchQuery);
      if (filterDate) params.append('date', filterDate);

      const res = await fetch(`http://localhost:8000/api/activity-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data || []);
        setTotalLogs(data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filterAction, searchQuery, filterDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchLogs]);

  return (
    <div className="max-w-300 mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Activity Log</h2>
        <p className="text-sm text-slate-500 mt-1">Riwayat aktivitas pengguna dalam sistem</p>
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
            placeholder="Nama user, deskripsi aktivitas..."
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>
        <div className="w-48">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Tipe Aktivitas
          </label>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
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
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Tanggal
          </label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
          />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">Memuat riwayat aktivitas...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Tidak ada riwayat ditemukan.</div>
          ) : (
            logs.map((log) => {
              const config = ACTIVITY_CONFIG[log.action] || {
                icon: 'info',
                bg: 'bg-slate-100',
                text: 'text-slate-500',
              };
              return (
                <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center ${config.text} shrink-0`}>
                    <span className="material-symbols-outlined text-[18px]">{config.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">
                      <span className="font-semibold">{log.user_name}</span>{' '}
                      <span className="text-slate-600">{log.description}</span>
                    </p>
                    <p className="font-mono text-xs text-slate-400 mt-1">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-slate-500 text-sm">
            Menampilkan {logs.length} dari {totalLogs} aktivitas
          </span>
        </div>
      </div>
    </div>
  );
}