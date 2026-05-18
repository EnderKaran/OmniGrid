"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MOCK_DATA = [
  { time: "00:00", entry: 1200, exit: 900 },
  { time: "04:00", entry: 1300, exit: 1000 },
  { time: "08:00", entry: 2100, exit: 1500 },
  { time: "12:00", entry: 1800, exit: 1700 },
  { time: "16:00", entry: 2400, exit: 1400 },
  { time: "20:00", entry: 1600, exit: 1200 },
  { time: "23:59", entry: 1400, exit: 1100 },
];

export function MainChart() {
  const [filter, setFilter] = useState("24h");

  return (
    <div className="flex w-full flex-col rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Stock Entry vs. Exit</h3>
          <p className="text-sm text-slate-400">Real-time inventory flow analytics</p>
        </div>
        
        <div className="flex items-center gap-1 rounded-lg bg-slate-950/50 p-1 border border-white/5">
          {["24h", "7d", "30d"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                filter === f
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEntry" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.2)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10} 
            />
            <YAxis 
              stroke="rgba(255,255,255,0.2)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
              }}
              itemStyle={{ color: "#fff", fontSize: "12px" }}
              labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
            />
            
            {/* Exit Area (Dashed-like appearance via strokeDasharray) */}
            <Area
              type="monotone"
              dataKey="exit"
              name="Stock Exit"
              stroke="#64748b"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="transparent"
              activeDot={{ r: 4, fill: "#64748b" }}
            />
            
            {/* Entry Area (Gradient) */}
            <Area
              type="monotone"
              dataKey="entry"
              name="Stock Entry"
              stroke="#22d3ee"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorEntry)"
              activeDot={{ r: 6, fill: "#0f172a", stroke: "#22d3ee", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
