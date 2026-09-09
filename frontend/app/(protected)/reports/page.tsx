'use client';

import React, { useState, useEffect, useCallback } from 'react';

const REPORT_TYPES = [
  {
    id: 'profit-loss',
    title: 'Laporan Laba Rugi',
    description: 'Ringkasan pendapatan, beban, dan laba bersih periode berjalan',
    icon: 'trending_up',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    id: 'cash-flow',
    title: 'Laporan Arus Kas',
    description: 'Pergerakan kas masuk dan keluar per kategori dan periode',
    icon: 'account_balance',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    id: 'balance-sheet',
    title: 'Neraca',
    description: 'Posisi aset, liabilitas, dan ekuitas perusahaan',
    icon: 'balance',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    id: 'expense-breakdown',
    title: 'Rincian Pengeluaran',
    description: 'Breakdown pengeluaran per departemen dan kategori',
    icon: 'pie_chart',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

const DEFAULT_REPORTS = [
  { name: 'Laporan Laba Rugi - Oktober 2023', type: 'PDF', date: '2023-10-27', size: '284 KB' },
  { name: 'Arus Kas - Q3 2023', type: 'XLSX', date: '2023-10-15', size: '512 KB' },
  { name: 'Rincian Pengeluaran - September 2023', type: 'PDF', date: '2023-10-02', size: '198 KB' },
  { name: 'Neraca - September 2023', type: 'PDF', date: '2023-10-01', size: '221 KB' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('this-month');
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, profit: 0, margin: 0 });
  const [recentReports, setRecentReports] = useState<any[]>([]);

  const fetchReportData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Ambil transaksi dari API backend
      const res = await fetch('/api/transactions');
      if (!res.ok) throw new Error('Gagal mengambil data');
      const responseData = await res.json();

      // Memastikan format data berupa Array
      const saved = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData.data)
          ? responseData.data
          : [];

      // Hitung ringkasan
      let totalIncome = 0;
      let totalExpense = 0;

      saved.forEach((t: any) => {
        const type = (t.type || '').toLowerCase();
        const amount = Number(t.amount || 0);
        if (type === 'income' || type === 'pemasukan' || type === 'in') {
          totalIncome += amount;
        } else if (type === 'expense' || type === 'pengeluaran' || type === 'out') {
          totalExpense += amount;
        }
      });

      const profit = totalIncome - totalExpense;
      const margin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

      setSummary({
        income: totalIncome,
        expense: totalExpense,
        profit: profit,
        margin: margin,
      });

      // Hitung data grafik 6 bulan terakhir
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
      const monthlyData: Record<string, { income: number; expense: number }> = {};

      saved.forEach((t: any) => {
        const dateStr = t.date || t.created_at;
        if (!dateStr) return;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return;

        const m = months[d.getMonth()];
        if (!monthlyData[m]) monthlyData[m] = { income: 0, expense: 0 };

        const type = (t.type || '').toLowerCase();
        const amount = Number(t.amount || 0);
        if (type === 'income' || type === 'pemasukan' || type === 'in') {
          monthlyData[m].income += amount;
        } else if (type === 'expense' || type === 'pengeluaran' || type === 'out') {
          monthlyData[m].expense += amount;
        }
      });

      const currentMonthIdx = new Date().getMonth();
      const chartArr = [];
      let maxVal = 0;

      for (let i = 5; i >= 0; i--) {
        let mIdx = currentMonthIdx - i;
        if (mIdx < 0) mIdx += 12;
        const mName = months[mIdx];
        const data = monthlyData[mName] || { income: 0, expense: 0 };
        chartArr.push({ month: mName, income: data.income, expense: data.expense });
        if (data.income > maxVal) maxVal = data.income;
        if (data.expense > maxVal) maxVal = data.expense;
      }

      const normalizedChart = chartArr.map((d) => ({
        month: d.month,
        rawIncome: d.income,
        rawExpense: d.expense,
        incomePct: maxVal > 0 ? (d.income / maxVal) * 100 : 0,
        expensePct: maxVal > 0 ? (d.expense / maxVal) * 100 : 0,
      }));

      setChartData(normalizedChart);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData();

    const savedReports = localStorage.getItem('mock_reports');
    if (savedReports) {
      try {
        setRecentReports(JSON.parse(savedReports));
      } catch {
        setRecentReports(DEFAULT_REPORTS);
      }
    } else {
      setRecentReports(DEFAULT_REPORTS);
      localStorage.setItem('mock_reports', JSON.stringify(DEFAULT_REPORTS));
    }
  }, [fetchReportData]);

  const formatShortRupiah = (amount: number) => {
    if (Math.abs(amount) >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}M`;
    if (Math.abs(amount) >= 1000) return `Rp ${(amount / 1000).toFixed(1)}K`;
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const downloadReport = (title: string, date: string) => {
    const csvRows = [];
    csvRows.push([`"${title}"`]);
    csvRows.push([`"Tanggal Dibuat:", "${date}"`]);
    csvRows.push([]);
    csvRows.push(['"Ringkasan Transaksi"']);
    csvRows.push(['"Keterangan"', '"Nilai"']);
    csvRows.push([`"Total Pendapatan"`, `"${summary.income}"`]);
    csvRows.push([`"Total Pengeluaran"`, `"${summary.expense}"`]);
    csvRows.push([`"Laba Bersih"`, `"${summary.profit}"`]);

    const csvContent = csvRows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}_${date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = (title: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newReport = {
      name: `${title} - Generated`,
      type: 'CSV',
      date: today,
      size: `${Math.floor(Math.random() * 50) + 10} KB`,
    };

    const updated = [newReport, ...recentReports];
    setRecentReports(updated);
    localStorage.setItem('mock_reports', JSON.stringify(updated));

    downloadReport(newReport.name, newReport.date);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
          <p className="text-sm text-slate-500 mt-1">Generate dan unduh laporan keuangan</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
        >
          <option value="this-month">Bulan Ini</option>
          <option value="last-month">Bulan Lalu</option>
          <option value="this-quarter">Kuartal Ini</option>
          <option value="this-year">Tahun Ini</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_TYPES.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col gap-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-lg ${report.bg} flex items-center justify-center ${report.color}`}>
              <span className="material-symbols-outlined text-[20px]">{report.icon}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                {report.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{report.description}</p>
            </div>
            <button
              onClick={() => handleGenerate(report.title)}
              className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-primary self-start cursor-pointer hover:underline"
            >
              Generate
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expense Chart */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Pendapatan vs Pengeluaran</h3>
            <span className="text-xs text-slate-500">6 Bulan Terakhir</span>
          </div>

          <div className="flex-1 relative min-h-55 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size[20px_20px] rounded-lg p-4 flex items-end gap-6">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                Memuat data grafik...
              </div>
            ) : (
              chartData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 shadow-lg pointer-events-none">
                    In: {formatShortRupiah(d.rawIncome)} | Out: {formatShortRupiah(d.rawExpense)}
                  </div>

                  <div className="w-full flex items-end justify-center gap-1 h-40">
                    <div
                      className="w-4 bg-emerald-500 rounded-t transition-all duration-500"
                      style={{ height: `${d.incomePct}%`, minHeight: d.incomePct > 0 ? '4px' : '0' }}
                    ></div>
                    <div
                      className="w-4 bg-rose-400 rounded-t transition-all duration-500"
                      style={{ height: `${d.expensePct}%`, minHeight: d.expensePct > 0 ? '4px' : '0' }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{d.month}</span>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <span className="w-3 h-3 rounded bg-emerald-500"></span> Pendapatan
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <span className="w-3 h-3 rounded bg-rose-400"></span> Pengeluaran
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Ringkasan Total Transaksi</h3>
          <div className="space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">Total Pendapatan</span>
              <span className="font-mono font-semibold text-emerald-600">
                {formatShortRupiah(summary.income)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">Total Pengeluaran</span>
              <span className="font-mono font-semibold text-rose-600">
                {formatShortRupiah(summary.expense)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">Laba Bersih</span>
              <span
                className={`font-mono font-semibold ${summary.profit >= 0 ? 'text-slate-900' : 'text-rose-600'
                  }`}
              >
                {formatShortRupiah(summary.profit)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Margin</span>
              <span
                className={`font-mono font-semibold ${summary.margin >= 0 ? 'text-primary' : 'text-rose-600'
                  }`}
              >
                {summary.margin.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Laporan Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3">Nama Laporan</th>
                <th className="p-3">Tipe</th>
                <th className="p-3">Tanggal Dibuat</th>
                <th className="p-3">Ukuran</th>
                <th className="p-3 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {recentReports.map((report, idx) => (
                <tr key={`${report.name}-${idx}`} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-[16px]">description</span>
                      </div>
                      <span className="font-medium text-slate-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600">
                      {report.type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{report.date}</td>
                  <td className="p-3 text-slate-500">{report.size}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => downloadReport(report.name, report.date)}
                        className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Download"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                          download
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}