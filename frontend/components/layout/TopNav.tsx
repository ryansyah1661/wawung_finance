"use client";

export default function TopNav() {
  return (
    <header className="hidden md:flex items-center justify-between px-4 w-full h-16 bg-background border-b border-slate-200 z-10 shrink-0">
      <div className="flex-1 max-w-md relative flex items-center">
        <span className="material-symbols-outlined absolute left-3 text-muted-foreground">search</span>
        <input
          className="w-full pl-10 pr-4 py-2 bg-background border border-slate-200 rounded-xl text-foreground focus:ring-2 focus:ring-ring focus:border-transparent text-sm outline-none"
          placeholder="Search transactions, invoices..."
          type="text"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-primary transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <img
          alt="User Profile"
          className="w-8 h-8 rounded-full object-cover border border-slate-200"
          src="/avatar.png"
        />
      </div>
    </header>
  );
}