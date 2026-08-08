'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Memanggil API transaksi dari Laravel Backend
    api.get('/transactions')
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Gagal ambil data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Uji Coba Next.js + Laravel API</h1>
      {loading ? (
        <p>Sedang mengambil data dari backend Laravel...</p>
      ) : (
        <pre className="bg-slate-100 p-4 rounded-lg text-sm text-slate-800">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}