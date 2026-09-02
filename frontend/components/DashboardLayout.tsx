"use client";

import Sidebar from "./layout/Sidebar";
import TopNav from "./layout/TopNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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