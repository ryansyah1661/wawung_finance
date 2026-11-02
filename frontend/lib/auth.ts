export const AUTH_KEYS = [
  'user_id',
  'user_name',
  'user_email',
  'user_role',
  'user_department',
  'user_phone',
  'user_position',
  'session_expires_at',
  'last_activity_at',
  'remember_me',
];

// 60 menit tanpa aktivitas klik/ketik/scroll -> otomatis logout
export const MAX_IDLE_TIME = 60 * 60 * 1000;

// Sesi default tanpa "Ingat Saya": 2 Jam
export const DEFAULT_SESSION_DURATION = 2 * 60 * 60 * 1000;

// Sesi dengan "Ingat Saya": 7 Hari
export const REMEMBER_ME_DURATION = 7 * 24 * 60 * 60 * 1000;

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function isSessionValid(): { valid: boolean; reason?: 'expired' | 'idle' | 'no_session' } {
  if (typeof window === 'undefined') return { valid: false, reason: 'no_session' };

  const userId = localStorage.getItem('user_id');
  const expiresAt = localStorage.getItem('session_expires_at');
  const lastActivity = localStorage.getItem('last_activity_at');

  if (!userId) {
    return { valid: false, reason: 'no_session' };
  }

  // Jika session_expires_at belum ada (user dari sesi versi lama), set expired agar login ulang yang aman
  if (!expiresAt) {
    return { valid: false, reason: 'expired' };
  }

  const now = Date.now();

  // 1. Cek batas waktu kadaluarsa sesi (2 jam atau 7 hari)
  if (now > Number(expiresAt)) {
    return { valid: false, reason: 'expired' };
  }

  // 2. Cek waktu inaktif / tidak ada aktivitas (60 menit)
  if (lastActivity && now - Number(lastActivity) > MAX_IDLE_TIME) {
    return { valid: false, reason: 'idle' };
  }

  return { valid: true };
}

export function setAuthSession(user: any, rememberMe: boolean) {
  if (typeof window === 'undefined') return;

  const duration = rememberMe ? REMEMBER_ME_DURATION : DEFAULT_SESSION_DURATION;
  const now = Date.now();

  localStorage.setItem('user_id', String(user.id));
  localStorage.setItem('user_name', user.name || '');
  localStorage.setItem('user_email', user.email || '');
  localStorage.setItem('user_role', user.role || '');
  localStorage.setItem('user_department', user.department || '');
  localStorage.setItem('user_phone', user.phone || '');
  localStorage.setItem('user_position', user.position || '');
  localStorage.setItem('session_expires_at', String(now + duration));
  localStorage.setItem('last_activity_at', String(now));
  localStorage.setItem('remember_me', rememberMe ? 'true' : 'false');
}

let lastUpdate = 0;
export function updateLastActivity() {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  // Throttle update setiap 15 detik agar tidak membebani localStorage
  if (now - lastUpdate > 15000) {
    lastUpdate = now;
    localStorage.setItem('last_activity_at', String(now));
  }
}
