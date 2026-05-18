import { Activity, Clock, HardDrive, Key } from "lucide-react";

import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// Mock Data (Shelf B Context)
// ──────────────────────────────────────────────

const MOCK_METADATA = {
  id: "SH-B-027",
  uuid: "8f4a3b19-c2e7-49f3-a1b4-7d8e9f2a4b5c",
  loadStatus: "High — Approaching Limit",
  lastScan: "10m ago",
  scanAccuracy: "99.8%",
  zone: "Zone 3 / Cold Storage",
};

// ──────────────────────────────────────────────
// DetailedMetadata Widget
// ──────────────────────────────────────────────

export function DetailedMetadata() {
  return (
    <div className="flex h-full flex-col justify-between gap-4 pt-1">
      {/* Primary Badge & ID */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-semibold tracking-tight text-slate-200">
            {MOCK_METADATA.id}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-white/[0.03] border border-white/[0.05] px-2.5 py-1.5 w-fit">
          <Key className="h-3 w-3 text-emerald-400/80" />
          <span className="font-mono text-[10px] text-slate-500">
            {MOCK_METADATA.uuid}
          </span>
        </div>
      </div>

      {/* Load Status (Warning Badge) */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
          Load Status
        </span>
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.05] px-3 py-2">
          <Activity className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          <span className="text-xs font-medium text-amber-300">
            {MOCK_METADATA.loadStatus}
          </span>
        </div>
      </div>

      {/* Zone & Scan Info */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex flex-col gap-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
          <span className="text-[10px] uppercase tracking-[0.1em] text-slate-500">
            Zone
          </span>
          <span className="text-xs font-medium text-slate-300">
            {MOCK_METADATA.zone}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
          <span className="text-[10px] uppercase tracking-[0.1em] text-slate-500 flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> Last Scan
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">
              {MOCK_METADATA.lastScan}
            </span>
            <span className="text-[10px] text-emerald-400/90">
              {MOCK_METADATA.scanAccuracy}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
