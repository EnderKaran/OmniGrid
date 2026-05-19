"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Menu, X, Terminal } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 flex-col lg:flex-row">
      {/* Mobile Top Navigation Bar */}
      <header className="flex h-14 w-full items-center justify-between border-b border-border/60 bg-sidebar/80 backdrop-blur-md px-4 sticky top-0 z-40 lg:hidden select-none">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center border border-primary bg-primary/10 text-primary transition-all">
            <Terminal className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-bold uppercase tracking-[0.15em] text-white">
            Omni<span className="text-primary">Grid</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          className="flex h-8 w-8 items-center justify-center border border-border bg-card/20 text-slate-400 hover:text-white hover:border-primary/45 active:scale-95 transition-all"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      {/* Mobile Drawer (Sidebar) Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer Content Container with slide-in animation */}
          <div className="fixed inset-y-0 left-0 w-[240px] bg-sidebar z-50 flex flex-col h-full border-r border-border">
            {/* Sidebar content */}
            <div className="flex-1 h-full" onClick={() => setIsOpen(false)}>
              <DashboardSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Shared Sidebar */}
      <div className="w-[220px] hidden lg:block shrink-0">
        <DashboardSidebar />
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto min-w-0">
        {children}
      </div>
    </div>
  );
}
