<!-- TopNavBar (Navbar Atas) -->
<header class="hidden md:flex items-center justify-between px-6 w-full h-16 bg-surface text-primary border-b border-outline-variant z-10 shrink-0">
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
        <div class="h-6 w-px bg-slate-700"></div>

        <!-- Notification Bell -->
        <button class="text-on-surface-variant hover:text-primary transition-colors relative">
            <span class="material-symbols-outlined text-xl">notifications</span>
            <span class="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
        </button>
        
        <!-- User Avatar & Dropdown -->
        <div class="relative" x-data="{ open: false }">
            <button @click="open = !open" class="flex items-center gap-2 focus:outline-none">
                <div class="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold hover:opacity-90 transition-opacity">
                    {{ strtoupper(substr(Auth::user()->name ?? 'A', 0, 1)) }}
                </div>
            </button>

            <!-- Dropdown Content -->
            <div x-show="open" 
                 @click.outside="open = false" 
                 x-transition 
                 class="absolute right-0 mt-2 w-48 bg-primary border border-slate-700 rounded-xl shadow-lg py-2 z-50">
                <div class="px-4 py-2 border-b border-slate-700">
                    <p class="text-body-sm text-on-surface font-semibold truncate">{{ Auth::user()->name ?? 'Admin' }}</p>
                    <p class="text-xs text-on-surface-variant truncate">{{ Auth::user()->email ?? 'admin@wawung.com' }}</p>
                </div>
                <form method="POST" action="{{ route('logout') }}" class="mt-1">
                    @csrf
                    <button type="submit" class="w-full flex items-center gap-2 px-4 py-2 text-body-sm text-error hover:bg-error-container/20 transition-colors text-left">
                        <span class="material-symbols-outlined text-lg">logout</span>
                        Logout
                    </button>
                </form>
            </div>
        </div>
    </div>
</header>