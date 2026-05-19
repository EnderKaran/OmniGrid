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

// Types
type ItemStatus = "normal" | "warning" | "critical";

interface InventoryItem {
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

// Mock Data
const MOCK_DATA: InventoryItem[] = [
  {
    id: "1",
    name: "Quantum Processor X1",
    loc: "A-12-04",
    stock: "0452",
    unit: "UNITS",
    sku: "QP-9921",
    trend: "↑ 12%",
    status: "normal",
    chartData: [40, 30, 50, 45, 60, 55, 75]
  },
  {
    id: "2",
    name: "Hydraulic Valve M4",
    loc: "B-02-11",
    stock: "0004",
    unit: "UNITS",
    sku: "HV-4410",
    trend: "REORDER",
    status: "critical",
    chartData: [20, 20, 20, 20, 20, 20, 20]
  },
  {
    id: "3",
    name: "Optical Sensors 500",
    loc: "C-14-22",
    stock: "1205",
    unit: "UNITS",
    sku: "OS-5000",
    trend: "Stable",
    status: "normal",
    chartData: [50, 45, 55, 50, 60, 55, 50]
  },
  {
    id: "4",
    name: "Ceramic Capacitor",
    loc: "A-01-09",
    stock: "8540",
    unit: "UNITS",
    sku: "CC-102K",
    trend: "↑ 5%",
    status: "normal",
    chartData: [70, 72, 75, 78, 80, 85, 90]
  },
  {
    id: "5",
    name: "Lithium Ion Pack",
    loc: "H-22-01",
    stock: "0092",
    unit: "UNITS",
    sku: "LI-2200",
    trend: "Volatile",
    status: "normal",
    chartData: [60, 30, 80, 20, 90, 40, 70]
  },
  {
    id: "6",
    name: "Titanium Bolts M8",
    loc: "T-09-55",
    stock: "5000",
    unit: "BOXES",
    sku: "TB-0080",
    trend: "Steady",
    status: "normal",
    chartData: [50, 50, 50, 50, 50, 50, 50]
  },
  {
    id: "7",
    name: "Logic Gate Arrays",
    loc: "L-33-01",
    stock: "0010",
    unit: "UNITS",
    sku: "LG-7400",
    trend: "REORDER",
    status: "warning",
    chartData: [80, 70, 60, 40, 20, 10, 5]
  },
  {
    id: "8",
    name: "Copper Wire 20AWG",
    loc: "C-05-99",
    stock: "3200",
    unit: "METERS",
    sku: "CW-20AWG",
    trend: "↑ 2%",
    status: "normal",
    chartData: [40, 42, 45, 44, 46, 48, 50]
  },
  {
    id: "9",
    name: "Thermal Paste",
    loc: "X-90-12",
    stock: "0150",
    unit: "TUBES",
    sku: "TP-MX04",
    trend: "↑ 8%",
    status: "normal",
    chartData: [30, 35, 40, 38, 45, 50, 55]
  },
  {
    id: "10",
    name: "Stepper Motor NEMA17",
    loc: "M-17-44",
    stock: "0032",
    unit: "UNITS",
    sku: "SM-NEMA17",
    trend: "Cyclical",
    status: "normal",
    chartData: [80, 20, 80, 20, 80, 20, 80]
  },
  {
    id: "11",
    name: "LCD Display 16x2",
    loc: "D-16-02",
    stock: "0420",
    unit: "UNITS",
    sku: "LCD-1602",
    trend: "No Change",
    status: "normal",
    chartData: [50, 50, 50, 50, 50, 50, 50]
  },
  {
    id: "12",
    name: "Resistor 10k Ohm",
    loc: "R-10-KK",
    stock: "9999+",
    unit: "UNITS",
    sku: "R-10K",
    trend: "↑ 1%",
    status: "normal",
    chartData: [90, 92, 91, 95, 96, 94, 98]
  }
];

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

  const color = status === "normal" ? "#2dd4bf" : "#f59e0b"; // teal-400 or amber-500

  return (
    <div className="w-full h-12 relative flex items-end">
      <svg viewBox="0 -10 100 120" className="w-full h-full preserve-3d overflow-visible" preserveAspectRatio="none">
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
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
};

export default function InventoryCommandGrid() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-teal-500/30">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 bg-teal-500/10 rounded-md hover:bg-teal-500/20 transition-colors cursor-pointer">
              <LayoutGrid className="w-5 h-5 text-teal-400" />
            </Link>
            <h1 className="text-lg font-bold tracking-widest text-white flex items-center gap-2">
              WMS COMMAND<span className="text-teal-400">.GRID</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="SEARCH SKU, ITEM OR LOCATION..." 
                className="w-full bg-white/5 border border-white/5 text-slate-200 text-sm rounded-md py-2 pl-10 pr-16 focus:outline-none focus:ring-1 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all font-mono placeholder:font-sans"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-block border border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                  CTRL+K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Sector Selector */}
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 tracking-wide">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              SECTOR 7G
              <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
            </button>

            {/* Notification */}
            <button className="relative p-1.5 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border border-slate-950"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">Alex R.</span>
                <span className="text-[10px] font-mono tracking-widest text-teal-400">OPS_LEAD</span>
              </div>
              <div className="w-9 h-9 rounded-md bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/5 bg-slate-900/20">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveFilter("all")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-wide transition-colors",
                activeFilter === "all" ? "bg-teal-500/20 text-teal-400" : "hover:bg-white/5 text-slate-400"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              ALL ITEMS
            </button>
            <button 
              onClick={() => setActiveFilter("critical")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-wide transition-colors",
                activeFilter === "critical" ? "bg-amber-500/20 text-amber-400" : "hover:bg-white/5 text-slate-400"
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              CRITICAL (5)
            </button>
            <button 
              onClick={() => setActiveFilter("moving")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-wide transition-colors",
                activeFilter === "moving" ? "bg-blue-500/20 text-blue-400" : "hover:bg-white/5 text-slate-400"
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              MOVING FAST
            </button>

            <div className="h-4 w-px bg-white/10 mx-2" />
            <span className="text-xs text-slate-500 tracking-wider">
              FILTER BY: <span className="text-slate-300 cursor-pointer hover:text-white">Category</span> <span className="text-slate-300 cursor-pointer hover:text-white ml-2">Zone</span>
            </span>
          </div>

          <div className="text-[10px] font-mono tracking-widest text-slate-500 flex items-center gap-2">
            LAST SYNC: 14:02:45
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-pulse" />
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="p-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {MOCK_DATA.map((item) => (
            <div 
              key={item.id} 
              className="group bg-slate-900/40 border border-white/5 hover:border-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between h-[180px]"
            >
              {/* Card Top */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 truncate pr-2" title={item.name}>
                    {item.name}
                  </h3>
                  <div className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">
                    LOC: {item.loc}
                  </div>
                </div>
                <div 
                  className={cn(
                    "w-2 h-2 rounded-full mt-1 shrink-0",
                    item.status === "normal" ? "bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  )} 
                />
              </div>

              {/* Card Middle (Stock & Chart) */}
              <div className="flex items-end justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="text-[9px] font-mono text-slate-500 mb-1 uppercase tracking-widest">Stock Level</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className={cn(
                      "text-3xl font-bold font-mono tracking-tighter",
                      item.status === "critical" || item.status === "warning" ? "text-amber-500" : "text-white"
                    )}>
                      {item.stock}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{item.unit}</span>
                  </div>
                </div>
                <div className="w-[80px] shrink-0">
                  <Sparkline data={item.chartData} status={item.status} />
                </div>
              </div>

              {/* Card Bottom */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  SKU: {item.sku}
                </div>
                
                {item.trend === "REORDER" ? (
                  <button className="text-[10px] font-bold tracking-widest text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-2 py-1 rounded transition-colors uppercase">
                    REORDER
                  </button>
                ) : (
                  <div className={cn(
                    "text-[10px] font-mono tracking-wider text-right",
                    item.trend.includes("↑") ? "text-teal-400" : "text-slate-400"
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
      <footer className="fixed bottom-0 w-full border-t border-white/5 bg-slate-950/90 backdrop-blur-sm px-6 py-2 flex justify-between items-center z-40">
        <div className="text-[10px] font-mono text-slate-500 tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50" />
          SYSTEM ONLINE
        </div>
        <div className="text-[10px] font-mono text-slate-500 tracking-widest">
          SERVER: US-EAST-1
        </div>
        <div className="text-[10px] font-mono text-slate-600 tracking-widest">
          CMD_GRID_V2.4.0
        </div>
      </footer>

    </div>
  );
}
