<!-- TopNavBar (Navbar Atas) -->
<header class="hidden md:flex items-center justify-between px-6 w-full h-16 bg-white text-slate-800 border-b border-slate-200 z-10 shrink-0">
    <div></div> <!-- Spacer Kiri -->

    <!-- Topbar Kanan -->
    <div class="flex items-center gap-5">
        <!-- Dynamic Time Greeting Logic -->
        @php
            $hour = now()->format('H'); // Ambil jam saat ini (00 - 23)
    
            if ($hour >= 5 && $hour < 11) {
                $greeting = 'Selamat Pagi';
            } elseif ($hour >= 11 && $hour < 15) {
                $greeting = 'Selamat Siang';
            } elseif ($hour >= 15 && $hour < 18) {
                $greeting = 'Selamat Sore';
            } else {
                $greeting = 'Selamat Malam';
            }
        @endphp

        <!-- Pasang variabel $greeting di HTML kamu -->
        <div class="text-right">
            <p class="font-bold text-slate-900 text-sm">
                {{ $greeting }}, {{ auth()->user()->name ?? 'Admin Wawung' }}
            </p>
            <p class="text-xs text-slate-400 mt-0.5">
                {{ now()->format('d F Y') }}
            </p>
        </div>

        <!-- Separator -->
        <div class="h-6 w-px bg-slate-200"></div>

        <!-- Notification Bell -->
        <button class="text-slate-500 hover:text-slate-800 transition-colors relative">
            <span class="material-symbols-outlined text-xl">notifications</span>
            <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <!-- User Avatar & Dropdown -->
        <div class="relative" x-data="{ open: false }">
            <button @click="open = !open" class="flex items-center gap-2 focus:outline-none">
                <div class="w-8 h-8 rounded-full bg-red-800 text-white flex items-center justify-center font-bold hover:opacity-90 transition-opacity text-sm shadow-xs">
                    {{ strtoupper(substr(Auth::user()->name ?? 'A', 0, 1)) }}
                </div>
            </button>

            <!-- Dropdown Content (Versi Light Mode) -->
            <div x-show="open" 
                 @click.outside="open = false" 
                 x-transition 
                 class="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-50">
                
                <div class="px-4 py-3 border-b border-slate-100">
                    <p class="text-sm font-semibold text-slate-900 leading-none truncate">{{ Auth::user()->name ?? 'Admin Wawung' }}</p>
                    <p class="text-xs text-slate-500 mt-1 truncate">{{ Auth::user()->email ?? 'admin@wawung.com' }}</p>
                </div>

                <form method="POST" action="{{ route('logout') ?? '#' }}" class="mt-1">
                    @csrf
                    <button type="submit" class="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
                        <span class="material-symbols-outlined text-lg text-red-500">logout</span>
                        Logout
                    </button>
                </form>
            </div>
        </div>
    </div>
</header>