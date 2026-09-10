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

const ROLE_CONFIG: Record<string, { label: string; bg: string; text: string; icon?: string }> = {
  superadmin: { label: 'Superadmin', bg: 'bg-amber-100', text: 'text-amber-800', icon: 'workspace_premium' },
  director: { label: 'Director', bg: 'bg-purple-100', text: 'text-purple-800', icon: 'stars' },
  finance: { label: 'Finance', bg: 'bg-blue-100', text: 'text-blue-800', icon: 'payments' },
  pm: { label: 'PM', bg: 'bg-slate-100', text: 'text-slate-700', icon: 'assignment' },
};

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'pm', department: '' });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!userToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8000/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } else {
        alert('Gagal menghapus user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8000/api/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUser),
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        setEditUser(null);
        fetchUsers();
      } else {
        alert('Gagal mengupdate user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
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

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, password: 'password123' }),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewUser({ name: '', email: '', role: 'pm', department: '' });
        fetchUsers();
      } else {
        alert('Gagal menambahkan user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOrder: Record<string, number> = { superadmin: 1, director: 2, finance: 3, pm: 4 };
  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99));

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
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-white hover:brightness-110 transition-colors px-4 py-2 rounded-lg flex items-center gap-2 text-sm cursor-pointer shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              person_add
            </span>
            Tambah User
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
              Nonaktif
            </p>
            <p className="text-xl font-bold text-slate-900 font-mono">
              {users.filter((u) => (u.status || 'active') !== 'active').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <span className="material-symbols-outlined text-[20px]">person_off</span>
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
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${roleStyle.bg} ${roleStyle.text}`}
                        >
                          {roleStyle.icon && (
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                              {roleStyle.icon}
                            </span>
                          )}
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
                            onClick={() => handleEditClick(user)}
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
                            onClick={() => confirmDelete(user)}
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

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Tambah User Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="superadmin">Superadmin</option>
                  <option value="director">Director</option>
                  <option value="finance">Finance</option>
                  <option value="pm">Project Manager (PM)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Departemen <span className="normal-case font-normal text-slate-400 ml-1">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:brightness-110 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Edit User</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editUser.name}
                  onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={editUser.email}
                  onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({...editUser, role: e.target.value as User['role']})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="superadmin">Superadmin</option>
                  <option value="director">Director</option>
                  <option value="finance">Finance</option>
                  <option value="pm">Project Manager (PM)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Departemen <span className="normal-case font-normal text-slate-400 ml-1">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={editUser.department || ''}
                  onChange={(e) => setEditUser({...editUser, department: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:brightness-110 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden text-center p-6">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>warning</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus User</h3>
            <p className="text-sm text-slate-500 mb-6">
              Apakah Anda yakin ingin menghapus user <strong>{userToDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors w-full"
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors disabled:opacity-50 w-full"
              >
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}