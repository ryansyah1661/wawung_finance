"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./layout/Sidebar";
import TopNav from "./layout/TopNav";
import { PageSkeleton } from "@/components/ui/PageSkeleton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.replace('/login');
    } else {
      setIsAuthenticated(true);
    }
    setChecking(false);
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
