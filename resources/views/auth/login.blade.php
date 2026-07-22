<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>{{ config('app.name', 'Kawungpitu Institute') }} - Login</title>
    
    <!-- CSS via Vite -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <!-- Google Fonts & Material Symbols -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
</head>
<body class="bg-slate-50 min-h-screen flex flex-col items-center justify-center p-4 text-slate-800 font-sans antialiased">

<!-- Main Login Container -->
<main class="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 fade-in-up shadow-sm">
    
    <!-- Header Logo & Title -->
    <div class="text-center mb-8">
        <div class="brand-icon w-12 h-12 text-xl mx-auto mb-3">
            K
        </div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Kawungpitu Institute</h1>
        <p class="text-xs text-slate-500 font-medium mt-1">Internal Finance Portal</p>
    </div>

    <!-- Login Form -->
    <form action="{{ route('login') }}" method="POST" class="space-y-5">
        @csrf

        <!-- Email Field -->
        <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700 block uppercase tracking-wider" for="email">
                Email Address
            </label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <span class="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input 
                    class="input-field @error('email') border-red-500 @enderror" 
                    id="email" 
                    name="email" 
                    value="{{ old('email') }}" 
                    placeholder="nama@kawungpitu.com" 
                    required 
                    autofocus
                    type="email"
                />
            </div>
            @error('email')
                <p class="text-red-600 text-xs mt-1 font-medium">{{ $message }}</p>
            @enderror
        </div>

        <!-- Password Field -->
        <div class="space-y-1.5">
            <div class="flex items-center justify-between">
                <label class="text-xs font-semibold text-slate-700 block uppercase tracking-wider" for="password">
                    Password
                </label>
                @if (Route::has('password.request'))
                    <a class="text-xs text-red-700 hover:text-red-800 font-medium transition-colors" href="{{ route('password.request') }}">
                        Lupa password?
                    </a>
                @endif
            </div>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <span class="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input 
                    class="input-field pr-10 @error('password') border-red-500 @enderror" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                />
                <button 
                    id="togglePassword"
                    aria-label="Toggle password visibility" 
                    class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none" 
                    type="button"
                >
                    <span id="eyeIcon" class="material-symbols-outlined text-[20px]">visibility</span>
                </button>
            </div>
            @error('password')
                <p class="text-red-600 text-xs mt-1 font-medium">{{ $message }}</p>
            @enderror
        </div>

        <!-- Remember Me -->
        <div class="flex items-center pt-1">
            <input 
                class="h-4 w-4 rounded border-slate-300 text-red-700 focus:ring-red-700 cursor-pointer accent-red-700" 
                id="remember_me" 
                name="remember" 
                type="checkbox"
            />
            <label class="ml-2 block text-xs font-medium text-slate-600 cursor-pointer select-none" for="remember_me">
                Ingat Saya
            </label>
        </div>

        <!-- Submit Button -->
        <button class="btn-primary-kawung" type="submit">
            MASUK
        </button>
    </form>
</main>

<!-- Footer -->
<footer class="mt-8 text-center fade-in-up" style="animation-delay: 0.15s;">
    <p class="text-xs text-slate-400 font-medium">
        © {{ date('Y') }} Kawungpitu Institute. All rights reserved.
    </p>
</footer>

<script>
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    togglePassword.addEventListener('click', function () {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        eyeIcon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
    });
</script>

</body>
</html>