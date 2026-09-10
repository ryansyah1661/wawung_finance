'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(m => m.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(m => m.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false });

export default function SuperadminDashboard() {
  const router = useRouter();

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [dueInvoices, setDueInvoices] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<{ name: string, amount: number, color: string }[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch paralel dari API Laravel
        const [resTrx, resFR, resRB, resInv] = await Promise.all([
          fetch('http://localhost:8000/api/transactions'),
          fetch('http://localhost:8000/api/fund-requests'),
          fetch('http://localhost:8000/api/reimbursements'),
          fetch('http://localhost:8000/api/invoices')
        ]);

        const rawTrx = resTrx.ok ? await resTrx.json() : [];
        const rawFR = resFR.ok ? await resFR.json() : [];
        const rawRB = resRB.ok ? await resRB.json() : [];
        const rawInv = resInv.ok ? await resInv.json() : [];

        const transactions = Array.isArray(rawTrx)
          ? rawTrx
          : Array.isArray(rawTrx?.data)
            ? rawTrx.data
            : Array.isArray(rawTrx?.data?.data)
              ? rawTrx.data.data
              : [];

        const fundRequests = Array.isArray(rawFR)
          ? rawFR
          : Array.isArray(rawFR?.data)
            ? rawFR.data
            : Array.isArray(rawFR?.data?.data)
              ? rawFR.data.data
              : [];

        const reimbursements = Array.isArray(rawRB)
          ? rawRB
          : Array.isArray(rawRB?.data)
            ? rawRB.data
            : Array.isArray(rawRB?.data?.data)
              ? rawRB.data.data
              : [];

        const invoices = Array.isArray(rawInv)
          ? rawInv
          : Array.isArray(rawInv?.data)
            ? rawInv.data
            : Array.isArray(rawInv?.data?.data)
              ? rawInv.data.data
              : [];

        // 1. OLAH DATA TRANSAKSI
        let incomeTotal = 0;
        let expenseTotal = 0;
        const catMap: Record<string, number> = {};

        transactions.forEach((t: any) => {
          const amt = Number(t.amount) || 0;
          const isIncome = (t.type || '').toLowerCase() === 'income';

          if (isIncome) {
            incomeTotal += amt;
          } else {
            expenseTotal += amt;
            const cat = t.category || 'Lainnya';
            catMap[cat] = (catMap[cat] || 0) + amt;
          }
        });

        setTotalIncome(incomeTotal);
        setTotalExpense(expenseTotal);
        setRecentTransactions(transactions.slice(0, 5));

        // 2. BREAKDOWN KATEGORI (DONUT CHART)
        const catColors: Record<string, string> = {
          'Operations': '#3b82f6',
          'Marketing': '#f59e0b',
          'Payroll': '#8b5cf6',
          'IT & Tech': '#06b6d4',
          'Income': '#10b981',
          'Lainnya': '#64748b',
        };
        const breakdown = Object.entries(catMap).map(([name, amount]) => ({
          name,
          amount,
          color: catColors[name] || '#64748b',
        }));
        setCategoryBreakdown(breakdown);

        // 3. TREN ARUS KAS (AREA CHART 6 BULAN TERAKHIR)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
        const monthlyIncome: Record<string, number> = {};
        const monthlyExpense: Record<string, number> = {};

        transactions.forEach((t: any) => {
          if (t.date) {
            const d = new Date(t.date);
            const monthLabel = monthNames[d.getMonth()];
            const amt = Number(t.amount) || 0;
            const isIncome = (t.type || '').toLowerCase() === 'income';

            if (isIncome) {
              monthlyIncome[monthLabel] = (monthlyIncome[monthLabel] || 0) + amt;
            } else {
              monthlyExpense[monthLabel] = (monthlyExpense[monthLabel] || 0) + amt;
            }
          }
        });

        const now = new Date();
        const monthData = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const label = monthNames[d.getMonth()];
          monthData.push({
            name: label,
            pemasukan: monthlyIncome[label] || 0,
            pengeluaran: monthlyExpense[label] || 0,
          });
        }
        setChartData(monthData);

        // 4. DATA APPROVAL & INVOICE
        const pendingFR = fundRequests.filter((f: any) => (f.status || 'Pending').toLowerCase() === 'pending');
        const pendingRB = reimbursements.filter((r: any) => (r.status || 'Pending').toLowerCase() === 'pending');

        const allPending = [
          ...pendingFR.map((f: any) => ({ ...f, source: 'Fund Request' })),
          ...pendingRB.map((r: any) => ({ ...r, source: 'Reimbursement' })),
        ];
        setPendingCount(allPending.length);
        setPendingItems(allPending.slice(0, 4));

        const upcoming = invoices
          .filter((inv: any) => !['paid', 'lunas'].includes((inv.status || '').toLowerCase()))
          .slice(0, 3);
        setDueInvoices(upcoming);

      } catch (error) {
        console.error('Gagal memuat data dashboard dari DB:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatRp = (n: number) => {
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
    if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} Jt`;
    return 'Rp ' + n.toLocaleString('id-ID');
  };

  const saldo = totalIncome - totalExpense;
  const totalCatAmount = categoryBreakdown.reduce((s, c) => s + c.amount, 0);

  const pieData = totalIncome > 0 || totalExpense > 0
    ? [
        { name: 'Pemasukan', amount: totalIncome, fill: '#10b981' },
        { name: 'Pengeluaran', amount: totalExpense, fill: '#f43f5e' },
      ].filter(d => d.amount > 0)
    : [{ name: 'Kosong', amount: 1, fill: '#e2e8f0' }];

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        Memuat data dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">

      {/* Greeting */}
      <header className="mb-2">
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1 tracking-tight">Selamat datang, Ahmad!</h2>
        <p className="text-sm text-slate-500">Berikut adalah ringkasan operasional Kawung Finance untuk hari ini.</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Pemasukan */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-xl"></div>
          <div className="flex justify-between items-start mb-3 pl-2">
            <span className="text-emerald-600 font-bold text-[11px] tracking-wider uppercase">Pemasukan</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <span className="material-symbols-outlined text-[22px]">trending_up</span>
            </div>
          </div>
          <div className="pl-2">
            <div className="text-2xl font-bold text-slate-900 mb-1.5 font-mono tracking-tight">
              <span className="text-sm font-semibold text-slate-500 mr-1">Rp</span>{totalIncome.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md w-fit">
              <span className="material-symbols-outlined text-[13px]">arrow_upward</span>
              {recentTransactions.filter((t: any) => (t.type || '').toLowerCase() === 'income').length} transaksi masuk
            </div>
          </div>
        </div>

        {/* Pengeluaran */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500 rounded-l-xl"></div>
          <div className="flex justify-between items-start mb-3 pl-2">
            <span className="text-rose-600 font-bold text-[11px] tracking-wider uppercase">Pengeluaran</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
              <span className="material-symbols-outlined text-[22px]">trending_down</span>
            </div>
          </div>
          <div className="pl-2">
            <div className="text-2xl font-bold text-slate-900 mb-1.5 font-mono tracking-tight">
              <span className="text-sm font-semibold text-slate-500 mr-1">Rp</span>{totalExpense.toLocaleString('id-ID')}
            </div>
            <div className="flex items-center gap-1 text-xs text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded-md w-fit">
              <span className="material-symbols-outlined text-[13px]">arrow_downward</span>
              {recentTransactions.filter((t: any) => (t.type || '').toLowerCase() === 'expense').length} transaksi keluar
            </div>
          </div>
        </div>

        {/* Saldo Bersih */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-xl"></div>
          <div className="flex justify-between items-start mb-3 pl-2">
            <span className="text-blue-600 font-bold text-[11px] tracking-wider uppercase">Saldo Bersih</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <span className="material-symbols-outlined text-[22px]">account_balance</span>
            </div>
          </div>
          <div className="pl-2">
            <div className={`text-2xl font-bold mb-1.5 font-mono tracking-tight ${saldo >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              <span className="text-sm font-semibold text-slate-500 mr-1">Rp</span>{Math.abs(saldo).toLocaleString('id-ID')}
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md w-fit ${saldo >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <span className="material-symbols-outlined text-[13px]">{saldo >= 0 ? 'arrow_upward' : 'arrow_downward'}</span>
              {saldo >= 0 ? 'Surplus — sehat' : 'Defisit — perlu perhatian'}
            </div>
          </div>
        </div>

        {/* Menunggu Approval */}
        <div
          onClick={() => router.push('/fund-requests')}
          className="bg-white border border-amber-200 shadow-sm rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400 rounded-l-xl"></div>
          <div className="flex justify-between items-start mb-3 pl-2">
            <span className="text-amber-600 font-bold text-[11px] tracking-wider uppercase">Menunggu Approval</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
          </div>
          <div className="flex items-end justify-between pl-2">
            <div>
              <div className="text-2xl text-slate-900 mb-1.5 font-mono font-bold tracking-tight">{pendingCount} <span className="text-sm text-slate-400 font-normal">items</span></div>
              <div className="flex items-center gap-1 text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-md w-fit">
                <span className="material-symbols-outlined text-[13px]">schedule</span>
                Perlu tindakan
              </div>
            </div>
            <span className="material-symbols-outlined text-amber-500 group-hover:translate-x-1 transition-transform text-[20px]">arrow_forward</span>
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area Chart */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Tren Arus Kas (Cash Flow)</h3>
            <div className="flex gap-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2"><span className="w-3 h-1.5 rounded-full bg-emerald-500"></span> Pemasukan</div>
              <div className="flex items-center gap-2"><span className="w-3 h-1.5 rounded-full bg-rose-400"></span> Pengeluaran</div>
            </div>
          </div>

          <div className="flex-1 min-h-70">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '6px', fontWeight: 600 }}
                  itemStyle={{ color: '#0f172a', fontSize: '12px', padding: '2px 0', fontWeight: 500 }}
                  formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Jumlah']}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="pemasukan" name="Pemasukan" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {chartData.every(d => d.pemasukan === 0 && d.pengeluaran === 0) && (
            <div className="text-center text-slate-400 text-xs py-2 -mt-4">
              Grafik akan terisi otomatis setelah Anda menambahkan transaksi
            </div>
          )}
        </div>

        {/* Donut Chart Area */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Komposisi Keuangan</h3>

          <div className="flex-1 flex items-center justify-center relative my-2">
            <div className="w-full relative flex items-center justify-center" style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={88}
                    paddingAngle={pieData.length > 1 ? 4 : 0}
                    dataKey="amount"
                    stroke="none"
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '10px', padding: '8px 12px' }}
                    itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                    formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Nominal']}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-slate-400 text-[11px] font-medium tracking-wide uppercase">Saldo Bersih</span>
                <span className={`text-base font-bold font-mono mt-0.5 ${saldo >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {saldo >= 0 ? '+' : '-'}Rp {Math.abs(saldo).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Legend Area */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            {totalIncome > 0 || totalExpense > 0 ? (
              <>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-emerald-500"></span>
                    <span className="text-slate-600 font-medium">Pemasukan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">Rp {totalIncome.toLocaleString('id-ID')}</span>
                    <span className="text-emerald-700 font-semibold font-mono w-10 text-right">
                      {totalIncome + totalExpense > 0 ? Math.round((totalIncome / (totalIncome + totalExpense)) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-rose-500"></span>
                    <span className="text-slate-600 font-medium">Pengeluaran</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">Rp {totalExpense.toLocaleString('id-ID')}</span>
                    <span className="text-rose-700 font-semibold font-mono w-10 text-right">
                      {totalIncome + totalExpense > 0 ? Math.round((totalExpense / (totalIncome + totalExpense)) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-400 text-center py-1">Belum ada data transaksi</div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Transaksi Terbaru Table */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl flex flex-col lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
            <h3 className="text-lg font-semibold text-slate-900">Transaksi Terbaru</h3>
            <button
              onClick={() => router.push('/transactions')}
              className="text-primary hover:underline text-xs transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              Lihat Semua <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Jumlah</th>
                  <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Tipe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentTransactions.length > 0 ? recentTransactions.map((trx: any, idx: number) => {
                  const isIncome = (trx.type || '').toLowerCase() === 'income';
                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-6 text-slate-500">{trx.date}</td>
                      <td className="py-3.5 px-6 text-slate-900 font-medium">{trx.description}</td>
                      <td className="py-3.5 px-6 text-slate-500">{trx.category}</td>
                      <td className={`py-3.5 px-6 font-mono text-right font-medium ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {isIncome ? '+' : '-'}Rp {Number(trx.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[10px] uppercase ${isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                          {trx.type}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="py-8 px-6 text-center text-slate-400 text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-[32px] text-slate-300">inbox</span>
                        Belum ada transaksi di database.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="flex flex-col gap-6">

          {/* Menunggu Approval List */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">pending_actions</span>
              Menunggu Approval
            </h3>
            {pendingItems.length > 0 ? (
              <ul className="space-y-3">
                {pendingItems.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-amber-300 transition-colors">
                    <div>
                      <div className="text-xs font-medium text-slate-900 mb-1">{item.description || item.title || 'Pengajuan Baru'}</div>
                      <div className="text-[11px] text-slate-500">{item.source}</div>
                      <div className="text-xs text-amber-600 font-mono font-semibold mt-1">
                        Rp {Number(item.amount || 0).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0 shadow-sm cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-slate-400 text-xs py-4">
                <span className="material-symbols-outlined text-[28px] text-slate-300 block mb-1">task_alt</span>
                Tidak ada pengajuan yang menunggu approval
              </div>
            )}
            {pendingCount > 4 && (
              <button
                onClick={() => router.push('/fund-requests')}
                className="w-full mt-4 text-center text-xs text-primary hover:underline font-semibold cursor-pointer"
              >
                Lihat {pendingCount - 4} lainnya
              </button>
            )}
          </div>

          {/* Invoice Jatuh Tempo List */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600">event_busy</span>
              Invoice Terbaru
            </h3>
            {dueInvoices.length > 0 ? (
              <ul className="space-y-3">
                {dueInvoices.map((inv: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border-l-4 border-l-rose-500 border border-slate-200">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-slate-900">{inv.number || inv.id || `INV-${idx + 1}`} — {inv.clientName || 'Client'}</div>
                      <div className="text-[11px] text-rose-600 font-medium mt-1">Status: {inv.status || 'Unpaid'}</div>
                    </div>
                    <div className="text-xs text-slate-900 font-mono font-semibold">
                      {formatRp(Number(inv.totalAmount || inv.amount || 0))}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-slate-400 text-xs py-4">
                <span className="material-symbols-outlined text-[28px] text-slate-300 block mb-1">receipt_long</span>
                Belum ada invoice
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}