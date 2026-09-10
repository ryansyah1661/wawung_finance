"use client";

import React, { useState } from 'react';
import api from '@/lib/api';

export default function TopNav() {
  const [userData, setUserData] = useState({ name: 'Ahmad Wijaya', role: 'Super Admin' });

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/1');
        if (res.data) {
          setUserData({
            name: res.data.name || 'Ahmad Wijaya',
            role: res.data.position || res.data.role || 'Super Admin',
          });
        }
      } catch (e) {
        console.error('Failed to fetch user', e);
      }
    };
    
    fetchUser();
    
    const handleUpdate = () => fetchUser();
    window.addEventListener('userProfileUpdated', handleUpdate);
    return () => window.removeEventListener('userProfileUpdated', handleUpdate);
  }, []);

  // Inisial nama pengguna (misal: AW untuk Ahmad Wijaya)
  const userName = userData.name;
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="hidden md:flex items-center justify-between px-6 w-full h-16 bg-white border-b border-slate-200 z-10 shrink-0">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative flex items-center">
        <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[20px]">
          search
        </span>
        <input
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent text-sm outline-none transition-all placeholder:text-slate-400"
          placeholder="Cari transaksi, invoice..."
          type="text"
        />
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifikasi */}
        <button className="text-slate-500 hover:text-blue-600 transition-colors relative p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs shadow-sm shrink-0">
            {userInitials || 'RS'}
          </div>

          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800">{userName}</span>
            <span className="text-[10px] text-slate-500 font-medium">{userData.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}