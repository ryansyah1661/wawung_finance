"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./layout/Sidebar";
import TopNav from "./layout/TopNav";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import api from "@/lib/api";
import { isSessionValid, clearAuthSession, updateLastActivity } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const handleLogoutExpired = useCallback((reason: string) => {
    clearAuthSession();
    setIsAuthenticated(false);
    router.replace(`/login?reason=${reason}`);
  }, [router]);

  useEffect(() => {
    const verifyAuth = async () => {
      // 1. Cek validitas sesi berdasarkan batas waktu & aktivitas
      const session = isSessionValid();
      if (!session.valid) {
        handleLogoutExpired(session.reason || 'expired');
        setChecking(false);
        return;
      }

      const userId = localStorage.getItem('user_id');

      // 2. Verifikasi ke backend bahwa server hidup & user valid
      try {
        const res = await api.get(`/users/${userId}`);
        if (res.data && (res.data.id || res.data.data?.id)) {
          setIsAuthenticated(true);
          updateLastActivity();
        } else {
          throw new Error('User tidak ditemukan');
        }
      } catch (err: any) {
        console.warn('Auth verification failed:', err.message || err);
        handleLogoutExpired('expired');
      } finally {
        setChecking(false);
      }
    };

    verifyAuth();

    // 3. Listener aktivitas user untuk memperbarui waktu aktif (idle detection)
    const onUserActivity = () => {
      updateLastActivity();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((evt) => window.addEventListener(evt, onUserActivity, { passive: true }));

    // 4. Timer interval untuk auto-logout jika tab dibiarkan terbuka melewati batas sesi / idle
    const interval = setInterval(() => {
      const check = isSessionValid();
      if (!check.valid) {
        handleLogoutExpired(check.reason || 'expired');
      }
    }, 15000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, onUserActivity));
      clearInterval(interval);
    };
  }, [router, handleLogoutExpired]);

  if (checking || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="flex overflow-hidden min-h-screen" data-layout="root">
      <div data-layout="sidebar">
        <Sidebar />
      </div>
      <div className="flex-1 md:ml-sidebar-width flex flex-col h-screen overflow-hidden bg-background" data-layout="content">
        <div data-layout="topnav">
          <TopNav />
        </div>
        <main className="flex-1 overflow-y-auto p-container-padding" data-layout="main">
          {children}
        </main>
      </div>
    </div>
  );
}
