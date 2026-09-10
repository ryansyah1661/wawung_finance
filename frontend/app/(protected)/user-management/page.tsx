'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'superadmin' | 'director' | 'finance' | 'pm';
  department: string | null;
  status?: string;
}

const ROLE_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  superadmin: { label: 'Superadmin', bg: 'bg-primary/10', text: 'text-primary' },
  director: { label: 'Director', bg: 'bg-purple-50', text: 'text-purple-700' },
  finance: { label: 'Finance', bg: 'bg-blue-50', text: 'text-blue-700' },
  pm: { label: 'PM', bg: 'bg-slate-100', text: 'text-slate-600' },
};

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users dari API Backend
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:8000/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        alert('Gagal menghapus user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleExportCSV = () => {
    import('xlsx').then((XLSX) => {
      const worksheet = XLSX.utils.json_to_sheet(
        users.map((u) => ({
          Nama: u.name,
          Email: u.email,
          Role: ROLE_CONFIG[u.role]?.label || u.role,
          Departemen: u.department || '-',
          Status: u.status || 'active',
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
      XLSX.writeFile(workbook, 'users_export.xlsx');
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-350 mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola akses pengguna dan hak akses role</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              download
            </span>
            Export
          </button>
          <button className="bg-primary text-white hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              person_add
            </span>
            Undang User
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total User
            </p>
            <p className="text-xl font-bold text-slate-900 font-mono">{users.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined text-[20px]">group</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Aktif
            </p>
            <p className="text-xl font-bold text-slate-900 font-mono">
              {users.filter((u) => (u.status || 'active') === 'active').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Undangan Pending
            </p>
            <p className="text-xl font-bold text-slate-900 font-mono">0</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-[20px]">mail</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama atau email..."
          className="w-full max-w-md bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3">Nama</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Departemen</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-400">
                    Memuat data user...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-400">
                    Tidak ada user ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleStyle = ROLE_CONFIG[user.role] || {
                    label: user.role,
                    bg: 'bg-slate-100',
                    text: 'text-slate-600',
                  };
                  const userStatus = user.status || 'active';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-500">{user.email}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${roleStyle.bg} ${roleStyle.text}`}
                        >
                          {roleStyle.label}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{user.department || '-'}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${userStatus === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                            }`}
                        >
                          {userStatus === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '18px' }}
                            >
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '18px' }}
                            >
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
      </div>
    </div>
  );
}