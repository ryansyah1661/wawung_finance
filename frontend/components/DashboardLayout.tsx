"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./layout/Sidebar";
import TopNav from "./layout/TopNav";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import api from "@/lib/api";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const userId = localStorage.getItem('user_id');

      // 1. Tidak ada data login di localStorage → langsung redirect
      if (!userId) {
        router.replace('/login');
        setChecking(false);
        return;
      }

      // 2. Ada data localStorage → verifikasi ke backend bahwa server hidup & user valid
      try {
        const res = await api.get(`/users/${userId}`);
        if (res.data && (res.data.id || res.data.data?.id)) {
          // Server merespons & user ditemukan → sesi valid
          setIsAuthenticated(true);
        } else {
          throw new Error('User tidak ditemukan');
        }
      } catch (err: any) {
        // Server mati / user tidak valid → hapus data sesi & redirect ke login
        console.warn('Auth verification failed:', err.message || err);
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_department');
        localStorage.removeItem('user_phone');
        localStorage.removeItem('user_position');
        router.replace('/login');
      } finally {
        setChecking(false);
      }
    };

    verifyAuth();
  }, [router]);

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
