'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transactions')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data:", error);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    // Redirect kembali ke login
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Topbar */}
        <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div>
            <h1 className="text-xl font-bold text-white">Dashboard Wawung Finance</h1>
            <p className="text-xs text-slate-400">Selamat datang kembali!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Data Transaksi dari Backend */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 space-y-4">
          <h2 className="text-lg font-semibold text-slate-200">Data Transaksi (Laravel API)</h2>
          
          {loading ? (
            <p className="text-slate-400 text-sm">Sedang memuat data dari Laravel...</p>
          ) : (
            <pre className="bg-slate-950 p-4 rounded-lg text-emerald-400 font-mono text-sm overflow-x-auto border border-slate-800">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>

      </div>
    </div>
  );
}