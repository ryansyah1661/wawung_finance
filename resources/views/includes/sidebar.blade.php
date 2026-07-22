<!-- SideNavBar (Sidebar Kiri) -->
<nav class="hidden md:flex flex-col h-full p-unit w-65 bg-white text-slate-800 font-body-md text-body-md fixed left-0 top-0 border-r border-slate-200 z-20 shadow-sm">
    
    <!-- Header Sidebar -->
    <div class="px-4 py-5 mb-2 flex items-center gap-3 border-b border-slate-100">
        <img src="{{ asset('images/kawung.png') }}" alt="Logo Kawungpitu" class="w-9 h-9 shrink-0 object-contain"/>
        <div class="min-w-0">
            <h1 class="font-bold text-slate-900 text-xs leading-tight truncate" title="Kawungpitu Institute">
                Kawungpitu Institute
            </h1>
            <p class="text-[11px] font-medium text-red-800/80 mt-0.5">Finance Portal</p>
        </div>
    </div>  

    <!-- Navigation Items -->
    <div class="flex-1 overflow-y-auto px-2 space-y-1">
        <!-- Dashboard -->
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-50 text-red-700 font-semibold shadow-xs">
            <span class="material-symbols-outlined text-xl">grid_view</span>
            <span>Dashboard</span>
        </a>

        <!-- Transactions -->
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="material-symbols-outlined text-xl">swap_horiz</span>
            <span>Transactions</span>
        </a>

        <!-- Fund Requests -->
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="material-symbols-outlined text-xl">request_quote</span>
            <span>Fund Requests</span>
        </a>

        <!-- Reimbursements -->
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="material-symbols-outlined text-xl">receipt_long</span>
            <span>Reimbursements</span>
        </a>

        <!-- Invoices -->
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="material-symbols-outlined text-xl">description</span>
            <span>Invoices</span>
        </a>

        <!-- Reports -->
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="material-symbols-outlined text-xl">bar_chart</span>
            <span>Reports</span>
        </a>

        <!-- Master Data -->
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="material-symbols-outlined text-xl">database</span>
            <span>Master Data</span>
        </a>

        <!-- User Management -->
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="material-symbols-outlined text-xl">manage_accounts</span>
            <span>User Management</span>
        </a>

        <!-- Audit Log -->
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="material-symbols-outlined text-xl">history</span>
            <span>Audit Log</span>
        </a>

        <!-- Settings -->
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <span class="material-symbols-outlined text-xl">settings</span>
            <span>Settings</span>
        </a>
    </div>
</nav>