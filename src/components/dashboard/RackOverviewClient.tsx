"use client";

import React, { useState } from "react";
import { 
  Home, 
  ChevronRight, 
  Plus, 
  Server, 
  Edit2, 
  Box, 
  Clock, 
  Lock, 
  ClipboardCheck,
  Terminal
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
    <div className="min-h-screen bg-background text-slate-300 font-mono text-[11px] flex flex-col lg:flex-row w-full selection:bg-primary/30">
      
      {/* LEFT SECTION (65%) */}
      <div className="flex-1 lg:w-[65%] p-6 lg:p-8 overflow-y-auto border-r border-border">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest mb-6">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            <Home className="w-3.5 h-3.5" />
          </Link>
          <span>WAREHOUSE_01</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{rack.zone.name}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-bold">{rack.name}</span>
          <span className="border border-accent/30 bg-accent/10 text-accent px-1.5 py-0.5 ml-1 font-bold">ONLINE</span>
        </div>

        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">{rack.name} Overview</h1>
            <p className="text-slate-500 mt-1 uppercase text-[10px] tracking-widest">{rack.zone.name} // ROW_{rack.row}</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              onChange={(e) => window.location.href = `/dashboard/rack/${e.target.value}`}
              value={rack.id}
              className="bg-card/45 border border-border text-slate-200 text-xs py-2 px-3 focus:outline-none focus:border-primary/50 uppercase rounded-none"
            >
              {allRacks.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name.toUpperCase()}
                </option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-primary bg-primary text-slate-950 font-bold hover:bg-transparent hover:text-primary transition-all text-xs uppercase tracking-widest">
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
                  "bg-card/25 border p-5 transition-all duration-300 cursor-pointer flex flex-col h-[280px]",
                  isSelected 
                    ? "border-primary/60 bg-primary/5 shadow-2xl shadow-black/40"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "w-10 h-10 border flex items-center justify-center transition-colors",
                    isSelected ? "border-primary bg-primary/10 text-primary" : "border-border bg-card/45 text-slate-400"
                  )}>
                    <Server className="w-5 h-5" />
                  </div>
                  <div className={cn(
                    "text-[9px] px-2 py-0.5 border font-bold uppercase tracking-widest",
                    isCritical && "border-destructive/30 text-destructive bg-destructive/10",
                    isOptimal && "border-accent/30 text-accent bg-accent/10",
                    shelf.capacityPercentage === 0 && "border-slate-500/30 text-slate-500 bg-slate-500/10"
                  )}>
                    {isCritical ? "High Load" : (isOptimal ? "Optimal" : "Empty")}
                  </div>
                </div>
                <h3 className="text-base font-bold text-white uppercase">{shelf.name}</h3>
                <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest">ID: SH-{rack.name.charAt(5)}-0{shelf.id}</p>
                
                <div className="mt-6 mb-2 flex justify-between text-[10px] uppercase">
                  <span className="text-slate-400">Capacity</span>
                  <span className="text-white font-bold">{shelf.capacityPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-card/65 border border-border/40 p-0.5 mb-auto">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500",
                      isCritical ? "bg-destructive" : "bg-primary"
                    )} 
                    style={{ width: `${shelf.capacityPercentage}%` }} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="border border-border bg-background/50 p-2 uppercase">
                    <div className="text-[9px] text-slate-500 tracking-widest mb-1">Temp</div>
                    <div className="text-xs font-bold text-white">{shelf.temperature !== null ? `${shelf.temperature.toFixed(1)}°C` : "N/A"}</div>
                  </div>
                  <div className="border border-border bg-background/50 p-2 uppercase">
                    <div className="text-[9px] text-slate-500 tracking-widest mb-1">Items</div>
                    <div className="text-xs font-bold text-white">{itemsCount}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Shelf */}
          <div className="border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 p-5 transition-all cursor-pointer flex flex-col items-center justify-center h-[280px] group text-slate-500 hover:text-primary">
            <div className="w-12 h-12 border border-border group-hover:border-primary/50 group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Add New Shelf</span>
          </div>

        </div>
      </div>

      {/* RIGHT SECTION (35%) - DETAILED METADATA */}
      {selectedShelf && (
        <div className="lg:w-[35%] bg-card/10 p-6 lg:p-8 overflow-y-auto">
          
          {/* Top Header */}
          <div className="mb-8 border-b border-border pb-6">
            <div className="text-[9px] text-primary font-bold tracking-widest uppercase mb-2">Detailed Metadata</div>
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-white uppercase">{selectedShelf.name}</h2>
                <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest truncate">UUID: 8F4A3B19-C2E7-49F3-A1B4-7D8E9F2A00{selectedShelf.id}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="p-2 border border-border hover:border-primary/50 hover:bg-card/45 text-slate-400 hover:text-white transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mini Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-card/25 border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Box className="w-3.5 h-3.5 text-primary" />
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Load Status</span>
              </div>
              <div className="text-base font-bold text-white uppercase">
                {selectedShelf.capacityPercentage > 80 ? "HIGH" : "OPTIMAL"}
              </div>
              <div className={cn(
                "text-[9px] mt-1 font-bold uppercase tracking-wider",
                selectedShelf.capacityPercentage > 80 ? "text-primary" : "text-accent"
              )}>
                {selectedShelf.capacityPercentage > 80 ? "APPROACHING_LIMIT" : "STABLE_CAPACITY"}
              </div>
            </div>
            
            <div className="bg-card/25 border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Last Scan</span>
              </div>
              <div className="text-base font-bold text-white uppercase">2M AGO</div>
              <div className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest">USER: AUTO-BOT</div>
            </div>
          </div>

          {/* Environment & Capacity */}
          <div className="mb-8">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Environment & Capacity</h3>
            
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2 uppercase">
                <span className="text-slate-400">Total Capacity</span>
                <span className="text-white font-bold">{selectedShelf.capacityPercentage}%</span>
              </div>
              <div className="w-full h-4 bg-card/65 border border-border/40 p-0.5 relative flex">
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: `${selectedShelf.capacityPercentage}%` }} 
                />
                {/* Gold tick coordinate bar */}
                <div 
                  className="absolute top-0 bottom-0 w-[2px] bg-accent transition-all duration-300" 
                  style={{ left: `${selectedShelf.capacityPercentage}%` }} 
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 mt-2">
                <span>0 UNITS</span>
                <span>1000 UNITS MAX</span>
              </div>
            </div>

            {/* Stats List */}
            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-slate-400">Temperature</span>
                <span className="font-bold text-primary">
                  {selectedShelf.temperature !== null ? `${selectedShelf.temperature.toFixed(1)}°C` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-slate-400">Humidity</span>
                <span className="font-bold text-white">42%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-slate-400">Weight</span>
                <span className="font-bold text-white">
                  {selectedShelf.weight !== null ? `${selectedShelf.weight}kg` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-slate-400">SKU Types</span>
                <span className="font-bold text-white">
                  {selectedShelf.products.length}
                </span>
              </div>
            </div>
          </div>

          {/* Physical Location */}
          <div className="mb-8">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Physical Location</h3>
            <div className="h-32 bg-background border border-border relative overflow-hidden flex items-center justify-center tech-grid">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-85" />
              
              {/* Target Indicator */}
              <div className="relative flex flex-col items-center">
                <div className="w-3 h-3 bg-accent shadow-[0_0_15px_rgba(45,212,191,1)] animate-pulse" />
                <div className="mt-2 text-[9px] font-mono bg-background border border-border px-2 py-0.5 text-white uppercase tracking-widest">
                  Target_Node
                </div>
              </div>
            </div>
          </div>

          {/* Top SKUs */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Top SKUs</h3>
              <Link href="/dashboard/inventory" className="text-[9px] text-primary hover:text-primary/75 transition-colors uppercase tracking-widest">[ VIEW_ALL ]</Link>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Item</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Qty</span>
              </div>
              
              {selectedShelf.products.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 uppercase tracking-widest">
                  NO STOCKS ON THIS SHELF
                </div>
              ) : (
                selectedShelf.products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3 border-b border-border/60">
                    <div className="min-w-0 pr-4">
                      <div className="text-white font-bold uppercase truncate">{p.name}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{p.sku}</div>
                    </div>
                    <div className="text-primary font-bold text-sm shrink-0">{p.quantity}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-border bg-card/25 hover:bg-card/45 text-white text-xs font-bold uppercase tracking-widest transition-all">
              <Lock className="w-4 h-4 text-primary" />
              Lock Shelf
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-primary bg-primary text-slate-950 text-xs font-bold uppercase tracking-widest transition-all hover:bg-transparent hover:text-primary">
              <ClipboardCheck className="w-4 h-4" />
              Audit
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
