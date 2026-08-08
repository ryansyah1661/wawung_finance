<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Kawungpitu Institute - Finance Dashboard</title>
    <link rel="icon" type="image/png" href="{{ asset('images/kawung.png') }}"/>

    <!-- Asset Bundler via Laravel Vite -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Alpine.js untuk fitur Dropdown Avatar -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <!-- Google Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
</head>
<body class="bg-slate-50 text-slate-800 font-body-md min-h-screen flex overflow-x-hidden">

<!-- 1. Include Sidebar Kiri -->
@include('includes.sidebar')

<!-- Main Workspace -->
<div class="flex-1 md:ml-64 flex flex-col min-h-screen bg-slate-50">
    
    <!-- 2. Include Topbar/Navbar Atas -->
    @include('includes.topbar')

    <!-- Main Content Scrollable Area -->
    <main class="flex-1 p-6 space-y-6">
        <div class="max-w-7xl mx-auto w-full space-y-6">
            
            <!-- Dashboard Title Area -->
            <header class="mb-2">
                <h2 class="font-display-lg text-2xl font-bold text-slate-900 mb-1">Dashboard Keuangan</h2>
                <p class="font-body-md text-sm text-slate-500">Berikut ringkasan performa operasional Kawungpitu Institute - Finance.</p>
            </header>

            <!-- Stats Row (4 Cards Top) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Pemasukan -->
                <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors group">
                    <div class="flex justify-between items-start mb-3">
                        <span class="text-slate-500 font-label-caps text-xs tracking-wider uppercase font-medium">Pemasukan</span>
                        <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <span class="material-symbols-outlined text-lg">trending_up</span>
                        </div>
                    </div>
                    <div>
                        <div class="font-data-mono-lg text-xl font-bold text-slate-900 mb-1">Rp 45.200.000</div>
                        <div class="flex items-center gap-1 font-body-sm text-xs text-emerald-600 font-medium">
                            <span class="material-symbols-outlined text-xs">arrow_upward</span>
                            12.5% vs bulan lalu
                        </div>
                    </div>
                </div>

                <!-- Pengeluaran -->
                <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors group">
                    <div class="flex justify-between items-start mb-3">
                        <span class="text-slate-500 font-label-caps text-xs tracking-wider uppercase font-medium">Pengeluaran</span>
                        <div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                            <span class="material-symbols-outlined text-lg">trending_down</span>
                        </div>
                    </div>
                    <div>
                        <div class="font-data-mono-lg text-xl font-bold text-slate-900 mb-1">Rp 12.800.000</div>
                        <div class="flex items-center gap-1 font-body-sm text-xs text-red-600 font-medium">
                            <span class="material-symbols-outlined text-xs">arrow_downward</span>
                            3.2% vs bulan lalu
                        </div>
                    </div>
                </div>

                <!-- Saldo Bersih -->
                <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors group relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div class="flex justify-between items-start mb-3 relative z-10">
                        <span class="text-slate-500 font-label-caps text-xs tracking-wider uppercase font-medium">Saldo Bersih</span>
                        <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <span class="material-symbols-outlined text-lg">account_balance</span>
                        </div>
                    </div>
                    <div class="relative z-10">
                        <div class="font-data-mono-lg text-xl font-bold text-slate-900 mb-1">Rp 32.400.000</div>
                        <div class="flex items-center gap-1 font-body-sm text-xs text-emerald-600 font-medium">
                            <span class="material-symbols-outlined text-xs">arrow_upward</span>
                            8.1% vs bulan lalu
                        </div>
                    </div>
                </div>

                <!-- Menunggu Approval -->
                <div class="bg-amber-50/50 rounded-xl p-5 flex flex-col justify-between hover:bg-amber-50 transition-colors group cursor-pointer border border-amber-200 shadow-sm">
                    <div class="flex justify-between items-start mb-3">
                        <span class="text-amber-700 font-label-caps text-xs tracking-wider uppercase font-semibold">Menunggu Approval</span>
                        <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                            <span class="material-symbols-outlined text-lg">pending_actions</span>
                        </div>
                    </div>
                    <div class="flex items-end justify-between">
                        <div>
                            <div class="font-data-mono-lg text-xl font-bold text-slate-900 mb-1">5 <span class="font-body-sm text-xs text-slate-500 font-normal">item</span></div>
                            <div class="font-body-sm text-xs text-slate-500">Butuh persetujuan</div>
                        </div>
                        <span class="material-symbols-outlined text-amber-600 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </div>
                </div>
            </div>

            <!-- Middle Row: Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Line Chart Area -->
                <div class="bg-white rounded-xl p-6 lg:col-span-2 flex flex-col border border-slate-200 shadow-sm">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="font-headline-sm text-lg font-semibold text-slate-900">Trend Arus Kas</h3>
                        <select class="bg-slate-50 border border-slate-200 rounded-lg text-xs font-body-sm text-slate-600 py-1.5 px-3 focus:ring-2 focus:ring-blue-500 outline-none">
                            <option>6 Bulan Terakhir</option>
                            <option>Tahun Ini</option>
                        </select>
                    </div>
                    <div class="flex-1 relative min-h-55 bg-slate-50/50 border border-slate-100 rounded-lg p-4 flex items-end">
                        <div class="absolute left-2 top-2 bottom-6 flex flex-col justify-between text-slate-400 font-data-mono-sm text-xs">
                            <span>60M</span><span>40M</span><span>20M</span><span>0</span>
                        </div>
                        <svg class="w-full h-44 pl-8 pb-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path class="opacity-90" d="M 0 80 Q 20 70, 40 50 T 60 40 T 80 20 T 100 30" fill="none" stroke="#10b981" stroke-width="2.5"></path>
                            <circle cx="100" cy="30" fill="#10b981" r="3"></circle>
                            <path class="opacity-80" d="M 0 90 Q 20 85, 40 80 T 60 70 T 80 75 T 100 65" fill="none" stroke="#ef4444" stroke-width="2.5"></path>
                            <circle cx="100" cy="65" fill="#ef4444" r="3"></circle>
                        </svg>
                        <div class="absolute bottom-1 left-12 right-4 flex justify-between text-slate-400 text-xs">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>Mei</span><span>Jun</span>
                        </div>
                        <div class="absolute top-2 right-2 flex gap-4 bg-white/90 px-3 py-1 rounded shadow-sm border border-slate-200 backdrop-blur-sm">
                            <div class="flex items-center gap-2 text-xs text-slate-600">
                                <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span> Pemasukan
                            </div>
                            <div class="flex items-center gap-2 text-xs text-slate-600">
                                <span class="w-2.5 h-2.5 bg-red-500 rounded-full inline-block"></span> Pengeluaran
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Donut Chart Area -->
                <div class="bg-white rounded-xl p-6 flex flex-col justify-between border border-slate-200 shadow-sm">
                    <h3 class="font-headline-sm text-lg font-semibold text-slate-900 mb-4">Komposisi Pengeluaran</h3>
                    <div class="flex-1 flex flex-col items-center justify-center my-2">
                        <div class="w-40 h-40 rounded-full flex items-center justify-center shadow-inner" style="background: conic-gradient(#3b82f6 0% 45%, #8b5cf6 45% 70%, #f59e0b 70% 88%, #64748b 88% 100%);">
                            <div class="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                                <span class="text-slate-400 text-xs">Total</span>
                                <span class="font-bold text-slate-900 text-sm mt-0.5">Rp 12.8M</span>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-y-2 gap-x-3 text-xs mt-4">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                            <span class="text-slate-700">Gaji</span>
                            <span class="text-slate-400 ml-auto font-mono">45%</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                            <span class="text-slate-700">Ops</span>
                            <span class="text-slate-400 ml-auto font-mono">25%</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                            <span class="text-slate-700">Marketing</span>
                            <span class="text-slate-400 ml-auto font-mono">18%</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
                            <span class="text-slate-700">Lainnya</span>
                            <span class="text-slate-400 ml-auto font-mono">12%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Transaksi Terbaru Table -->
                <div class="bg-white rounded-xl flex flex-col lg:col-span-2 overflow-hidden border border-slate-200 shadow-sm">
                    <div class="p-4 px-6 border-b border-slate-100 flex justify-between items-center bg-white">
                        <h3 class="font-headline-sm text-lg font-semibold text-slate-900">Transaksi Terbaru</h3>
                        <button class="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors flex items-center gap-1">
                            Lihat Semua <span class="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th class="py-3 px-6 text-xs text-slate-500 uppercase font-semibold">Tanggal</th>
                                    <th class="py-3 px-6 text-xs text-slate-500 uppercase font-semibold">Deskripsi</th>
                                    <th class="py-3 px-6 text-xs text-slate-500 uppercase font-semibold">Kategori</th>
                                    <th class="py-3 px-6 text-xs text-slate-500 uppercase font-semibold text-right">Jumlah</th>
                                    <th class="py-3 px-6 text-xs text-slate-500 uppercase font-semibold text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs">
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="py-3.5 px-6 text-slate-500">24 Okt 2023</td>
                                    <td class="py-3.5 px-6 text-slate-800 font-medium">Pembayaran Vendor IT</td>
                                    <td class="py-3.5 px-6 text-slate-500">Operasional</td>
                                    <td class="py-3.5 px-6 text-slate-900 font-mono font-medium text-right">-Rp 4.500.000</td>
                                    <td class="py-3.5 px-6 text-center">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">Terverifikasi</span>
                                    </td>
                                </tr>
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="py-3.5 px-6 text-slate-500">23 Okt 2023</td>
                                    <td class="py-3.5 px-6 text-slate-800 font-medium">Invoice Client A</td>
                                    <td class="py-3.5 px-6 text-slate-500">Pemasukan</td>
                                    <td class="py-3.5 px-6 text-emerald-600 font-mono font-medium text-right">+Rp 12.000.000</td>
                                    <td class="py-3.5 px-6 text-center">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">Terverifikasi</span>
                                    </td>
                                </tr>
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="py-3.5 px-6 text-slate-500">23 Okt 2023</td>
                                    <td class="py-3.5 px-6 text-slate-800 font-medium">Reimbursement Budi</td>
                                    <td class="py-3.5 px-6 text-slate-500">HR/Staff</td>
                                    <td class="py-3.5 px-6 text-slate-900 font-mono font-medium text-right">-Rp 850.000</td>
                                    <td class="py-3.5 px-6 text-center">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-semibold">Pending</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Right Cards -->
                <div class="flex flex-col gap-6">
                    <!-- Menunggu Approval Card -->
                    <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <h3 class="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <span class="material-symbols-outlined text-amber-500 text-xl">pending_actions</span>
                            Menunggu Approval
                        </h3>
                        <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-amber-400 transition-colors flex items-center justify-between">
                            <div>
                                <div class="text-xs font-medium text-slate-800 mb-1">Pengajuan Dana Dept Marketing</div>
                                <div class="text-sm font-bold font-mono text-amber-600">Rp 15.000.000</div>
                            </div>
                            <button class="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm">
                                <span class="material-symbols-outlined text-base">check</span>
                            </button>
                        </div>
                    </div>

                    <!-- Invoice Jatuh Tempo Card -->
                    <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <h3 class="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                            <span class="material-symbols-outlined text-red-500 text-xl">event_busy</span>
                            Invoice Jatuh Tempo
                        </h3>
                        <div class="p-3 bg-red-50/50 rounded-lg border-l-4 border-l-red-500 border border-slate-200 flex items-center justify-between">
                            <div class="flex-1">
                                <div class="text-xs font-medium text-slate-800">INV-2023-104 (PT Alpha)</div>
                                <div class="text-[11px] text-red-600 font-medium mt-1">Jatuh Tempo: Hari ini</div>
                            </div>
                            <div class="text-xs font-bold font-mono text-slate-900">Rp 8.5M</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- 3. Include Footer Bawah -->
        @include('includes.footer')
    </main>
</div>

</body>
</html>