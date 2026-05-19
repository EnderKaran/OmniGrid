import React from "react";
import { 
  Hexagon, 
  Settings, 
  Wifi, 
  BatteryMedium, 
  Maximize2, 
  PackageCheck, 
  CheckCircle2, 
  XCircle, 
  FileEdit, 
  AlertTriangle, 
  Check 
} from "lucide-react";
import Link from "next/link";

export default function ScannerPage() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-black text-white font-sans selection:bg-cyan-500/30">
      {/* 1. Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-slate-950/80 px-6 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/analytics" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Hexagon className="h-8 w-8 text-cyan-400" fill="currentColor" fillOpacity={0.2} />
          </Link>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight">STATION 04</span>
            <span className="text-[10px] font-light tracking-widest text-cyan-400">AR SCANNER ACTIVE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium tracking-widest text-emerald-400">ONLINE</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-4 text-slate-400">
            <Settings className="h-5 w-5 cursor-pointer hover:text-white transition-colors" />
            <Wifi className="h-5 w-5" />
            <div className="flex items-center gap-1">
              <BatteryMedium className="h-5 w-5" />
              <span className="text-xs font-mono">98%</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        {/* 2. Left / AR Camera View (60%) */}
        <div className="relative flex h-full w-[60%] flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?q=80&w=2000&blur=10')] bg-cover bg-center">
          {/* Overlay to darken slightly if needed */}
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Top Pill */}
            <div className="rounded-full bg-cyan-400 px-5 py-2 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
              <span className="text-xs font-bold tracking-widest text-black">TARGET LOCKED</span>
            </div>

            {/* Viewfinder Square */}
            <div className="relative h-72 w-72 md:h-96 md:w-96">
              {/* Corner brackets */}
              <div className="absolute left-0 top-0 h-12 w-12 border-l-4 border-t-4 border-cyan-500 rounded-tl-lg" />
              <div className="absolute right-0 top-0 h-12 w-12 border-r-4 border-t-4 border-cyan-500 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 h-12 w-12 border-b-4 border-l-4 border-cyan-500 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 h-12 w-12 border-b-4 border-r-4 border-cyan-500 rounded-br-lg" />
              
              {/* Scanning laser line effect */}
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-cyan-400 shadow-[0_0_15px_3px_rgba(34,211,238,0.8)] animate-pulse" />
            </div>

            {/* Bottom Pill */}
            <div className="rounded-full bg-black/70 px-6 py-2.5 backdrop-blur-md border border-white/10">
              <span className="text-sm font-medium text-slate-200">Align code within markers to scan</span>
            </div>
          </div>
        </div>

        {/* 3. Right Panel (40%) */}
        <div className="flex h-full w-[40%] flex-col border-l border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl z-10 shadow-2xl">
          
          {/* Card 1: Scanned Item */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <PackageCheck className="h-5 w-5" />
                <span className="text-sm font-bold tracking-wider uppercase">Package Found</span>
              </div>
              <Maximize2 className="h-4 w-4 text-slate-400 cursor-pointer hover:text-white transition-colors" />
            </div>
            
            <h2 className="mb-6 text-7xl font-black tracking-tighter text-white">ZX-9902</h2>
            
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="flex flex-col justify-center rounded-xl bg-white/5 p-4 border border-white/5">
                <span className="text-[10px] font-semibold tracking-widest text-slate-500">SHELF ID</span>
                <span className="text-xl font-bold text-white mt-1">A1-R24</span>
              </div>
              <div className="flex flex-col justify-center rounded-xl bg-white/5 p-4 border border-white/5">
                <span className="text-[10px] font-semibold tracking-widest text-slate-500">QUANTITY</span>
                <span className="text-xl font-bold text-white mt-1">150 <span className="text-sm font-normal text-slate-400">units</span></span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-orange-400" />
              <p className="text-sm font-medium text-orange-400 leading-snug">
                Verify batch number matches physical label.
              </p>
            </div>
          </div>

          {/* Card 2: Recent Scans */}
          <div className="mt-8 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-bold tracking-widest text-slate-500">RECENT SCANS</h3>
              <a href="#" className="text-xs font-medium text-cyan-400 hover:text-cyan-300">View All</a>
            </div>
            <div className="flex flex-col gap-3">
              {/* Confirmed Item */}
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/5">
                <span className="font-mono text-xl font-bold text-slate-200">ZX-9901</span>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Confirmed</span>
                </div>
              </div>
              
              {/* Confirmed Item */}
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/5">
                <span className="font-mono text-xl font-bold text-slate-200">ZX-8842</span>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Confirmed</span>
                </div>
              </div>

              {/* Error Item */}
              <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 p-4 transition-colors hover:bg-red-500/20">
                <span className="font-mono text-xl font-bold text-red-200">XY-2209</span>
                <div className="flex items-center gap-1.5 text-red-400">
                  <XCircle className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Error</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-white/5">
            <button className="group flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-orange-500 font-bold text-slate-950 transition-all hover:bg-orange-600 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              <Check className="h-6 w-6" />
              <span className="text-lg tracking-wide">CONFIRM TRANSACTION</span>
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
                <FileEdit className="h-4 w-4" />
                Manual Entry
              </button>
              <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
                <AlertTriangle className="h-4 w-4" />
                Report Issue
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
