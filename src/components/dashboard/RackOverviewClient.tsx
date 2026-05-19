"use client";

import React, { useState } from "react";
import { 
  Home, 
  ChevronRight, 
  Filter, 
  Plus, 
  Server, 
  Wrench, 
  Edit2, 
  X, 
  Box, 
  Clock, 
  Lock, 
  ClipboardCheck,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
}

interface Shelf {
  id: number;
  name: string;
  capacityPercentage: number;
  temperature: number | null;
  weight: number | null;
  products: Product[];
}

interface Rack {
  id: number;
  name: string;
  row: number;
  column: number;
  zone: {
    id: number;
    name: string;
    description: string | null;
  };
  shelves: Shelf[];
}

export function RackOverviewClient({ rack, allRacks }: { rack: Rack; allRacks: { id: number; name: string }[] }) {
  const [selectedShelfId, setSelectedShelfId] = useState<number>(rack.shelves[0]?.id || 0);

  const selectedShelf = rack.shelves.find((s) => s.id === selectedShelfId) || rack.shelves[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-teal-500/30 flex flex-col lg:flex-row w-full">
      
      {/* LEFT SECTION (65%) */}
      <div className="flex-1 lg:w-[65%] p-6 lg:p-8 overflow-y-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono tracking-wide mb-6">
          <Link href="/dashboard" className="hover:text-teal-400 transition-colors">
            <Home className="w-3.5 h-3.5" />
          </Link>
          <span>Warehouse 01</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{rack.zone.name}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium">{rack.name}</span>
          <span className="bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded text-[10px] ml-1">ACTIVE</span>
        </div>

        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{rack.name} Overview</h1>
            <p className="text-slate-500 mt-1 text-sm">{rack.zone.name} — Row {rack.row}</p>
            <p className="text-slate-600 text-xs mt-2 font-mono">Select a shelf to view detailed SKU breakdown and sensor metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select 
                onChange={(e) => window.location.href = `/dashboard/rack/${e.target.value}`}
                value={rack.id}
                className="bg-slate-900 border border-white/5 text-slate-200 text-xs rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-teal-500/50"
              >
                {allRacks.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-teal-400 hover:bg-teal-500 text-slate-950 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)]">
              <Plus className="w-4 h-4" />
              Add Shelf
            </button>
          </div>
        </div>

        {/* Shelf Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-20">
          
          {rack.shelves.map((shelf) => {
            const isSelected = shelf.id === selectedShelfId;
            const itemsCount = shelf.products.reduce((acc, p) => acc + p.quantity, 0);
            const isCritical = shelf.capacityPercentage > 80;
            const isOptimal = shelf.capacityPercentage <= 80 && shelf.capacityPercentage > 0;
            
            return (
              <div
                key={shelf.id}
                onClick={() => setSelectedShelfId(shelf.id)}
                className={cn(
                  "bg-slate-900/40 border rounded-xl p-5 backdrop-blur-md shadow-lg transition-all duration-300 ease-out cursor-pointer flex flex-col h-[280px]",
                  isSelected 
                    ? "border-teal-400/50 ring-1 ring-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.1)] bg-slate-900/60"
                    : "border-white/5 hover:border-white/10"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    isSelected ? "bg-teal-500/20 text-teal-400" : "bg-slate-800/50 text-slate-400"
                  )}>
                    <Server className="w-5 h-5" />
                  </div>
                  <div className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-mono border",
                    isCritical && "border-amber-500/30 text-amber-500 bg-amber-500/10",
                    isOptimal && "border-teal-500/30 text-teal-400 bg-teal-500/10",
                    shelf.capacityPercentage === 0 && "border-slate-500/30 text-slate-500 bg-slate-500/10"
                  )}>
                    {isCritical ? "High Load" : (isOptimal ? "Optimal" : "Empty")}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">{shelf.name}</h3>
                <p className="text-xs font-mono text-slate-500 mt-1">ID: SH-{rack.name.charAt(5)}-0{shelf.id}</p>
                
                <div className="mt-6 mb-2 flex justify-between text-xs">
                  <span className="text-slate-400">Capacity</span>
                  <span className="text-white font-mono font-medium">{shelf.capacityPercentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-auto">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isCritical ? "bg-amber-500" : "bg-teal-400"
                    )} 
                    style={{ width: `${shelf.capacityPercentage}%` }} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-slate-950/50 rounded-md p-2">
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Temp</div>
                    <div className="text-sm font-mono text-white">{shelf.temperature !== null ? `${shelf.temperature.toFixed(1)}°C` : "N/A"}</div>
                  </div>
                  <div className="bg-slate-950/50 rounded-md p-2">
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Items</div>
                    <div className="text-sm font-mono text-white">{itemsCount}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Shelf */}
          <div className="border-2 border-dashed border-slate-800 hover:border-teal-500/50 hover:bg-teal-500/5 rounded-xl p-5 transition-all cursor-pointer flex flex-col items-center justify-center h-[280px] group text-slate-500 hover:text-teal-400">
            <div className="w-12 h-12 rounded-full bg-slate-900 group-hover:bg-teal-500/10 flex items-center justify-center mb-4 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Add New Shelf</span>
          </div>

        </div>
      </div>

      {/* RIGHT SECTION (35%) - DETAILED METADATA */}
      {selectedShelf && (
        <div className="lg:w-[35%] bg-black/20 border-l border-white/5 p-6 lg:p-8 overflow-y-auto">
          
          {/* Top Header */}
          <div className="mb-8">
            <div className="text-[10px] text-teal-400 font-mono tracking-widest uppercase mb-2">Detailed Metadata</div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white uppercase">{selectedShelf.name}</h2>
                <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">UUID: 8f4a3b19-c2e7-49f3-a1b4-7d8e9f2a00{selectedShelf.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/5 rounded-md text-slate-400 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mini Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900/40 border border-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Box className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Load Status</span>
              </div>
              <div className="text-xl font-bold text-white">
                {selectedShelf.capacityPercentage > 80 ? "High" : "Optimal"}
              </div>
              <div className={cn(
                "text-[10px] mt-1 font-medium",
                selectedShelf.capacityPercentage > 80 ? "text-amber-500" : "text-emerald-400"
              )}>
                {selectedShelf.capacityPercentage > 80 ? "Approaching Limit" : "Stable Capacity"}
              </div>
            </div>
            
            <div className="bg-slate-900/40 border border-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Last Scan</span>
              </div>
              <div className="text-xl font-bold text-white">2m ago</div>
              <div className="text-[10px] text-slate-500 mt-1">User: Auto-Bot</div>
            </div>
          </div>

          {/* Environment & Capacity */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Environment & Capacity</h3>
            
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Total Capacity</span>
                <span className="text-white font-mono">{selectedShelf.capacityPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-teal-400 rounded-full" 
                  style={{ width: `${selectedShelf.capacityPercentage}%` }} 
                />
                {/* Cyan dot at the end */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-teal-400 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.8)] transition-all duration-300" 
                  style={{ left: `calc(${selectedShelf.capacityPercentage}% - 6px)` }} 
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-2">
                <span>0 Units</span>
                <span>1000 Units Max</span>
              </div>
            </div>

            {/* Stats List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Temperature</span>
                <span className="text-sm font-mono text-teal-400">
                  {selectedShelf.temperature !== null ? `${selectedShelf.temperature.toFixed(1)}°C` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Humidity</span>
                <span className="text-sm font-mono text-white">42%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">Weight</span>
                <span className="text-sm font-mono text-white">
                  {selectedShelf.weight !== null ? `${selectedShelf.weight}kg` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">SKU Types</span>
                <span className="text-sm font-mono text-white">
                  {selectedShelf.products.length}
                </span>
              </div>
            </div>
          </div>

          {/* Physical Location */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Physical Location</h3>
            <div className="h-32 bg-slate-900 rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">
              {/* Grid Pattern Background */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
              
              {/* Target Indicator */}
              <div className="relative flex flex-col items-center">
                <div className="w-3 h-3 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,1)] animate-pulse" />
                <div className="mt-2 text-[9px] font-mono bg-black/60 px-2 py-0.5 rounded text-white border border-white/10">Target</div>
              </div>
            </div>
          </div>

          {/* Top SKUs */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top SKUs</h3>
              <Link href="/dashboard/inventory" className="text-[10px] text-teal-400 hover:text-teal-300 transition-colors">View All</Link>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Item</span>
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Qty</span>
              </div>
              
              {selectedShelf.products.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 font-mono">
                  NO STOCKS ON THIS SHELF
                </div>
              ) : (
                selectedShelf.products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3 border-b border-white/5">
                    <div>
                      <div className="text-sm text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{p.sku}</div>
                    </div>
                    <div className="text-teal-400 font-mono text-sm">{p.quantity}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
              <Lock className="w-4 h-4" />
              Lock Shelf
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-teal-400 hover:bg-teal-500 text-slate-950 text-sm font-bold transition-colors shadow-[0_0_15px_rgba(45,212,191,0.2)]">
              <ClipboardCheck className="w-4 h-4" />
              Audit
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
