"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const REGIONAL_DATA = [
  { name: "North America", value: 65, color: "#22d3ee" }, // Cyan
  { name: "Europe", value: 25, color: "#3b82f6" },       // Blue
  { name: "Asia Pacific", value: 10, color: "#475569" }, // Slate
];

interface CapacityData {
  name: string;
  value: number;
  color: string;
}

export function BottomWidgets({ capacityData }: { capacityData?: CapacityData[] }) {
  // Fallback if not provided
  const data = capacityData || [
    { name: "Zone A (Cold Storage)", value: 92, color: "bg-rose-500" },
    { name: "Zone B (General)", value: 74, color: "bg-cyan-500" },
    { name: "Zone C (Hazmat)", value: 45, color: "bg-blue-500" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Regional Distribution */}
      <div className="flex flex-col rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg">
        <h3 className="mb-6 text-sm font-semibold text-white">Regional Distribution</h3>
        
        <div className="flex flex-1 items-center justify-between">
          <div className="relative h-32 w-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={REGIONAL_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  stroke="none"
                  dataKey="value"
                >
                  {REGIONAL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-slate-400">Total</span>
              <span className="text-sm font-bold text-white">4.2k</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3">
            {REGIONAL_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div 
                  className="h-2.5 w-2.5 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-slate-300 w-24">{item.name}</span>
                <span className="text-xs font-mono text-slate-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warehouse Capacity */}
      <div className="flex flex-col justify-between rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-white">Warehouse Capacity</h3>
          <span className="text-xs font-mono text-cyan-400">88% FULL</span>
        </div>

        <div className="flex flex-col gap-5">
          {data.map((zone) => (
            <div key={zone.name} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">{zone.name}</span>
                <span className="font-mono text-slate-400">{Math.round(zone.value)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div 
                  className={`h-full rounded-full ${zone.color}`} 
                  style={{ width: `${zone.value}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
