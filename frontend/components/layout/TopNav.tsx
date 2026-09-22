"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function TopNav() {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: '', role: '' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem('user_id') || '2'; // Default to ID 2 (Ryan Syah)
        const res = await api.get(`/users/${userId}`);
        if (res.data) {
          setUserData({
            name: res.data.name || '',
            role: res.data.position || res.data.role || '',
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

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem('user_id');
    router.push('/login');
  };

  // Inisial nama pengguna
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

        {/* User Profile Avatar with Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-lg hover:bg-slate-50 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs shadow-sm shrink-0">
              {userInitials || 'RS'}
            </div>

            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800">{userName || 'Ryan Syah'}</span>
              <span className="text-[10px] text-slate-500 font-medium">{userData.role || 'Specialist IT'}</span>
            </div>
            
            <span className="material-symbols-outlined text-slate-400 text-[18px]">
              expand_more
            </span>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                <Link 
                  href="/settings" 
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  Edit Profile
                </Link>
                <Link 
                  href="/settings?tab=security" 
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Ubah Password
                </Link>
                <div className="h-px bg-slate-100 my-1"></div>
                <button 
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  onClick={handleLogout}
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}