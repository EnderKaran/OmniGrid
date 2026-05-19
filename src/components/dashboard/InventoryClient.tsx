"use client";

import React, { useState } from "react";
import { 
  LayoutGrid, 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  AlertTriangle,
  Activity
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ItemStatus = "normal" | "warning" | "critical";

export interface InventoryItem {
  id: string;
  name: string;
  loc: string;
  stock: string;
  unit: string;
  sku: string;
  trend: string;
  status: ItemStatus;
  chartData: number[];
}

// SVG Sparkline Component
const Sparkline = ({ data, status }: { data: number[], status: ItemStatus }) => {
  const max = Math.max(...data) === Math.min(...data) ? Math.max(...data) + 1 : Math.max(...data);
  const min = Math.min(...data) === max ? 0 : Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const color = status === "normal" ? "oklch(0.82 0.16 142)" : "oklch(0.80 0.08 75)"; // emerald or gold

  return (
    <div className="w-full h-12 relative flex items-end">
      <svg viewBox="0 -10 100 120" className="w-full h-full preserve-3d overflow-visible animate-pulse" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${status}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4}/>
            <stop offset="100%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <polyline
          fill={`url(#gradient-${status})`}
          stroke="none"
          points={`0,100 ${points} 100,100`}
        />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          points={points}
        />
      </svg>
    </div>
  );
};

export function InventoryClient({ items }: { items: InventoryItem[] }) {
  const [activeFilter, setActiveFilter] = useState<"all" | "critical" | "moving">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) => {
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "critical" && (item.status === "critical" || item.status === "warning")) ||
      (activeFilter === "moving" && item.trend === "Stable" && item.status === "normal");
    
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.loc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const criticalCount = items.filter(i => i.status === "critical" || i.status === "warning").length;

  return (
    <div className="min-h-screen bg-background text-slate-300 font-mono text-[11px] selection:bg-primary/30">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-background/95 border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 border border-primary/20 bg-primary/10 hover:bg-primary/20 transition-all cursor-pointer">
              <LayoutGrid className="w-5 h-5 text-primary" />
            </Link>
            <h1 className="text-sm font-extrabold tracking-widest text-white flex items-center gap-2">
              WMS_COMMAND<span className="text-primary">.GRID</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="SEARCH SKU, ITEM OR LOCATION..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card/45 border border-border text-slate-200 text-xs py-2 pl-10 pr-16 focus:outline-none focus:border-primary/50 transition-all font-mono rounded-none"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Sector Selector */}
            <button className="flex items-center gap-2 border border-border bg-card/45 hover:bg-card/75 transition-all px-3 py-1.5 text-[9px] font-bold text-slate-300 tracking-widest uppercase">
              <div className="w-1.5 h-1.5 bg-primary" />
              SECTOR 7G
              <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
            </button>

            {/* Notification */}
            <button className="relative p-1.5 text-slate-400 hover:text-white transition-colors border border-border bg-card/25">
              <Bell className="w-4 h-4" />
              {criticalCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary border-t border-r border-background"></span>
              )}
            </button>

            {/* User Info from system or default */}
            <Link href="/dashboard/profile" className="flex items-center gap-3 pl-4 border-l border-border group cursor-pointer">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-white group-hover:text-primary transition-colors">OPS MANAGER</span>
                <span className="text-[9px] font-mono tracking-widest text-primary">OPS_LEAD</span>
              </div>
              <div className="w-9 h-9 border border-primary/30 bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <User className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-card/10">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveFilter("all")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 border text-[9px] font-extrabold tracking-widest transition-all",
                activeFilter === "all" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-card/25 text-slate-400"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              ALL ITEMS ({items.length})
            </button>
            <button 
              onClick={() => setActiveFilter("critical")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 border text-[9px] font-extrabold tracking-widest transition-all",
                activeFilter === "critical" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-card/25 text-slate-400"
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-primary" />
              CRITICAL ({criticalCount})
            </button>
            <button 
              onClick={() => setActiveFilter("moving")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 border text-[9px] font-extrabold tracking-widest transition-all",
                activeFilter === "moving" ? "border-accent bg-accent/10 text-accent" : "border-border hover:bg-card/25 text-slate-400"
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              MOVING FAST
            </button>
          </div>

          <div className="text-[9px] tracking-widest text-slate-500 flex items-center gap-2 font-bold">
            LAST SYNC: LIVE
            <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="p-6 max-w-[1600px] mx-auto pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="group bg-card/25 border border-border p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[180px] hover:border-primary/30"
            >
              {/* Card Top */}
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0 pr-4">
                  <h3 className="text-xs font-bold text-slate-200 uppercase truncate" title={item.name}>
                    {item.name}
                  </h3>
                  <div className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest">
                    LOC: {item.loc}
                  </div>
                </div>
                <div 
                  className={cn(
                    "w-2 h-2 shrink-0 mt-1",
                    item.status === "normal" ? "bg-accent shadow-[0_0_8px_rgba(45,212,191,0.5)]" : "bg-primary shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  )} 
                />
              </div>

              {/* Card Middle (Stock & Chart) */}
              <div className="flex items-end justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-widest">Stock Level</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className={cn(
                      "text-2xl font-black font-mono tracking-tighter",
                      item.status === "critical" || item.status === "warning" ? "text-primary" : "text-white"
                    )}>
                      {item.stock}
                    </span>
                    <span className="text-[9px] text-slate-500">{item.unit.toUpperCase()}</span>
                  </div>
                </div>
                <div className="w-[80px] shrink-0">
                  <Sparkline data={item.chartData} status={item.status} />
                </div>
              </div>

              {/* Card Bottom */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest">
                  SKU: {item.sku}
                </div>
                
                {item.trend === "REORDER" ? (
                  <button className="text-[9px] font-extrabold tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-1 transition-all uppercase animate-pulse">
                    REORDER
                  </button>
                ) : (
                  <div className={cn(
                    "text-[9px] tracking-widest font-bold uppercase text-right",
                    item.trend === "Stable" ? "text-accent" : "text-slate-400"
                  )}>
                    {item.trend}
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-0 w-full border-t border-border bg-background/95 px-6 py-2.5 flex justify-between items-center z-40">
        <div className="text-[9px] text-slate-500 tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary" />
          SYSTEM ONLINE
        </div>
        <div className="text-[9px] text-slate-500 tracking-widest uppercase">
          SERVER: US-EAST-1
        </div>
        <div className="text-[9px] text-slate-600 tracking-widest">
          CMD_GRID_V2.4.0
        </div>
      </footer>

    </div>
  );
}
