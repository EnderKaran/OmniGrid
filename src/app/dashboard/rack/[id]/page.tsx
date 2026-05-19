"use client";

import React from "react";
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
import { cn } from "@/lib/utils";

export default function RackOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-teal-500/30 flex flex-col lg:flex-row">
      
      {/* LEFT SECTION (65%) */}
      <div className="flex-1 lg:w-[65%] p-6 lg:p-8 overflow-y-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono tracking-wide mb-6">
          <Home className="w-3.5 h-3.5" />
          <span>Warehouse 01</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>Cold Storage</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium">Rack 14</span>
          <span className="bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded text-[10px] ml-1">ACTIVE</span>
        </div>

        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Rack 14 Overview</h1>
            <p className="text-slate-500 mt-1 text-sm">Zone B - Cold Storage</p>
            <p className="text-slate-600 text-xs mt-2 font-mono">Select a shelf to view detailed SKU breakdown and sensor metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900/40 border border-white/5 hover:bg-white/5 transition-colors text-sm font-medium">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-teal-400 hover:bg-teal-500 text-slate-950 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)]">
              <Plus className="w-4 h-4" />
              Add Shelf
            </button>
          </div>
        </div>

        {/* Shelf Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          
          {/* Shelf A */}
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-5 backdrop-blur-md hover:border-white/10 transition-all cursor-pointer flex flex-col h-[280px]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center">
                <Server className="w-5 h-5 text-slate-400" />
              </div>
              <div className="border border-teal-500/30 text-teal-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
                Optimal
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">Shelf A</h3>
            <p className="text-xs font-mono text-slate-500 mt-1">ID: SH-A-014</p>
            
            <div className="mt-6 mb-2 flex justify-between text-xs">
              <span className="text-slate-400">Capacity</span>
              <span className="text-white font-mono font-medium">45%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-auto">
              <div className="h-full bg-teal-400 rounded-full" style={{ width: "45%" }} />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-slate-950/50 rounded-md p-2">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Temp</div>
                <div className="text-sm font-mono text-white">-4.2°C</div>
              </div>
              <div className="bg-slate-950/50 rounded-md p-2">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Items</div>
                <div className="text-sm font-mono text-white">124</div>
              </div>
            </div>
          </div>

          {/* Shelf B (Selected) */}
          <div className="relative bg-slate-900/60 border border-teal-400/50 ring-1 ring-teal-400 rounded-xl p-5 backdrop-blur-md shadow-[0_0_20px_rgba(45,212,191,0.1)] flex flex-col h-[280px]">
            {/* Selected Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-400 text-slate-950 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">
              Selected
            </div>

            <div className="flex justify-between items-start mb-4 mt-2">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <Server className="w-5 h-5 text-teal-400" />
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] px-2 py-0.5 rounded-full font-mono">
                High Load
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">Shelf B</h3>
            <p className="text-xs font-mono text-slate-500 mt-1">ID: SH-B-014</p>
            
            <div className="mt-6 mb-2 flex justify-between text-xs">
              <span className="text-slate-400">Capacity</span>
              <span className="text-white font-mono font-medium">82%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-auto">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: "82%" }} />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-slate-950/50 rounded-md p-2">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Temp</div>
                <div className="text-sm font-mono text-white">-3.8°C</div>
              </div>
              <div className="bg-slate-950/50 rounded-md p-2">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Items</div>
                <div className="text-sm font-mono text-white">342</div>
              </div>
            </div>
          </div>

          {/* Shelf C (Empty/Dim) */}
          <div className="bg-slate-900/20 border border-white/5 rounded-xl p-5 backdrop-blur-md opacity-60 flex flex-col h-[280px]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800/30 flex items-center justify-center">
                <Server className="w-5 h-5 text-slate-600" />
              </div>
              <div className="bg-slate-800/50 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-mono">
                Empty
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-400">Shelf C</h3>
            <p className="text-xs font-mono text-slate-600 mt-1">ID: SH-C-014</p>
            
            <div className="mt-6 mb-2 flex justify-between text-xs">
              <span className="text-slate-600">Capacity</span>
              <span className="text-slate-500 font-mono font-medium">0%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800/50 rounded-full overflow-hidden mb-auto">
              <div className="h-full bg-slate-600 rounded-full" style={{ width: "0%" }} />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-slate-950/30 rounded-md p-2">
                <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-1">Temp</div>
                <div className="text-sm font-mono text-slate-500">-4.0°C</div>
              </div>
              <div className="bg-slate-950/30 rounded-md p-2">
                <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-1">Items</div>
                <div className="text-sm font-mono text-slate-500">0</div>
              </div>
            </div>
          </div>

          {/* Shelf D (Maintenance) */}
          <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-5 backdrop-blur-md flex flex-col h-[280px]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-red-400" />
              </div>
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
                Maintenance
              </div>
            </div>
            <h3 className="text-lg font-bold text-white">Shelf D</h3>
            <p className="text-xs font-mono text-slate-500 mt-1">ID: SH-D-014</p>
            
            <div className="mt-auto bg-red-950/30 border border-red-500/10 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-300/80 leading-relaxed">
                  Sensor calibration required.<br/>
                  Scheduled for inspection at 14:00.
                </p>
              </div>
            </div>
          </div>

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
      <div className="lg:w-[35%] bg-black/20 border-l border-white/5 p-6 lg:p-8 overflow-y-auto">
        
        {/* Top Header */}
        <div className="mb-8">
          <div className="text-[10px] text-teal-400 font-mono tracking-widest uppercase mb-2">Detailed Metadata</div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">SHELF B</h2>
              <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">UUID: 893-293-SH-B</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-md text-slate-400 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-md text-slate-400 transition-colors">
                <X className="w-4 h-4" />
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
            <div className="text-xl font-bold text-white">High</div>
            <div className="text-[10px] text-amber-500 mt-1">Approaching Limit</div>
          </div>
          
          <div className="bg-slate-900/40 border border-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Last Scan</span>
            </div>
            <div className="text-xl font-bold text-white">10m ago</div>
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
              <span className="text-white font-mono">82%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full relative">
              <div className="absolute top-0 left-0 h-full bg-teal-400 rounded-full" style={{ width: "82%" }} />
              {/* Cyan dot at the end */}
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-teal-400 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.8)]" style={{ left: "calc(82% - 6px)" }} />
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
              <span className="text-sm font-mono text-teal-400">-3.8°C</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-slate-400">Humidity</span>
              <span className="text-sm font-mono text-white">40%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-slate-400">Weight</span>
              <span className="text-sm font-mono text-white">450kg</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-slate-400">SKU Types</span>
              <span className="text-sm font-mono text-white">12</span>
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
            <span className="text-[10px] text-teal-400 hover:text-teal-300 cursor-pointer transition-colors">View All</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Item</span>
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Qty</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <div className="text-sm text-white">Frozen Peas 1kg</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">FP-1002</div>
              </div>
              <div className="text-teal-400 font-mono text-sm">150</div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <div className="text-sm text-white">Ice Cream Vanilla</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">IC-VAN-500</div>
              </div>
              <div className="text-teal-400 font-mono text-sm">85</div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <div>
                <div className="text-sm text-white">Mixed Berries</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">MX-BER-200</div>
              </div>
              <div className="text-teal-400 font-mono text-sm">42</div>
            </div>
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

    </div>
  );
}
