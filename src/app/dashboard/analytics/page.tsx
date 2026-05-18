import { Bell } from "lucide-react";
import { Sidebar } from "@/components/dashboard/analytics/Sidebar";
import { StatsCards } from "@/components/dashboard/analytics/StatsCards";
import { MainChart } from "@/components/dashboard/analytics/MainChart";
import { BottomWidgets } from "@/components/dashboard/analytics/BottomWidgets";
import { SystemLogsPanel } from "@/components/dashboard/analytics/SystemLogsPanel";

export default function AnalyticsDashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {/* 20% Sidebar */}
      <div className="w-[20%] hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* 55% Main Content */}
      <main className="flex-1 lg:w-[55%] flex flex-col px-8 py-6">
        {/* Top Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Supply Chain Overview
            </h1>
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                System Online
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 rounded-lg border border-white/5 bg-slate-900/40 px-3 py-1.5 backdrop-blur-md">
              <span className="text-xs text-slate-400">OCT 24, 2023 | 14:32:05 UTC</span>
            </div>
            <button className="relative rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyan-500 border-2 border-slate-950" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex flex-col gap-6 flex-1">
          <StatsCards />
          <MainChart />
          <BottomWidgets />
        </div>
      </main>

      {/* 25% System Logs */}
      <div className="w-[25%] hidden xl:block shrink-0">
        <SystemLogsPanel />
      </div>
    </div>
  );
}
