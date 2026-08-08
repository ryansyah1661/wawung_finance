'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transactions')
      .then((response) => {
        // Kita ambil langsung isi key 'data' dari response JSON Laravel
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Gagal ambil data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-slate-800">
        Uji Coba Next.js + Laravel API
      </h1>

      {loading ? (
        <p className="text-slate-500">Sedang mengunduh data...</p>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-medium">
            ✅ {data?.message || 'Koneksi Berhasil!'}
          </div>

          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}