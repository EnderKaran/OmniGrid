import { Droplets, Thermometer, Weight } from "lucide-react";

import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// Mock Data (Warehouse Wide & Avg)
// ──────────────────────────────────────────────

const MOCK_ENV = {
  totalCapacityUsed: 78,
  totalCapacityRaw: "1.2M",
  totalCapacityMax: "1.5M",
  temperature: "-3.8",
  humidity: "42",
  weightLoad: "840",
};

// ──────────────────────────────────────────────
// EnvironmentMetrics Widget
// ──────────────────────────────────────────────

export function EnvironmentMetrics() {
  return (
    <div className="flex h-full w-full flex-col gap-6 pt-2">
      {/* 1. Asymmetric Total Capacity Progress */}
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
              Warehouse Capacity
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-semibold tabular-nums tracking-tight text-white">
                {MOCK_ENV.totalCapacityRaw}
              </span>
              <span className="text-xs text-slate-500">
                / {MOCK_ENV.totalCapacityMax} units
              </span>
            </div>
          </div>
          <span className="text-sm font-medium tabular-nums text-emerald-400">
            {MOCK_ENV.totalCapacityUsed}%
          </span>
        </div>

        {/* Custom asymmetrical bar design */}
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/[0.04] border border-white/[0.06]">
          {/* Main fill */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600/50 to-emerald-400/80 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${MOCK_ENV.totalCapacityUsed}%` }}
          />
          {/* Glowing dot at the end */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-1000 ease-out"
            style={{ left: `calc(${MOCK_ENV.totalCapacityUsed}% - 4px)` }}
          />
        </div>
      </div>

      {/* 2. Environmental Grid (2-columns) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="group relative flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <Thermometer className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.1em] text-slate-400">
              Temperature
            </span>
            <span className="text-sm font-semibold tabular-nums text-white">
              {MOCK_ENV.temperature}°C
            </span>
          </div>
        </div>

        {/* Humidity */}
        <div className="group relative flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Droplets className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.1em] text-slate-400">
              Humidity
            </span>
            <span className="text-sm font-semibold tabular-nums text-white">
              {MOCK_ENV.humidity}%
            </span>
          </div>
        </div>

        {/* Total Weight Load (Spans 2 cols for asymmetry) */}
        <div className="col-span-2 group relative flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Weight className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.1em] text-slate-400">
                Est. Floor Load
              </span>
              <span className="text-sm font-semibold tabular-nums text-white">
                {MOCK_ENV.weightLoad} Tons
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] text-emerald-400/80 uppercase tracking-widest">
              Stable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
