"use client";

import Sidebar from "./layout/Sidebar";
import TopNav from "./layout/TopNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex overflow-hidden min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-sidebar-width flex flex-col h-screen overflow-hidden bg-background">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-container-padding">
          {children}
        </main>
      </div>
    </div>
  );
}