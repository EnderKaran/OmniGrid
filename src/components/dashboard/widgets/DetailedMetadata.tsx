import { Activity, Clock, HardDrive, Key } from "lucide-react";

interface DetailedMetadataProps {
  id?: string;
  uuid?: string;
  loadStatus?: string;
  lastScan?: string;
  scanAccuracy?: string;
  zone?: string;
}

export function DetailedMetadata({
  id = "SH-B-027",
  uuid = "8f4a3b19-c2e7-49f3-a1b4-7d8e9f2a4b5c",
  loadStatus = "Optimal Capacity",
  lastScan = "10m ago",
  scanAccuracy = "99.8%",
  zone = "Zone A (Cold Storage)",
}: DetailedMetadataProps) {
  return (
    <div className="flex h-full w-full flex-col justify-between gap-4 pt-1 font-mono text-[11px]">
      {/* Primary Badge & ID */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold tracking-wider text-slate-100 uppercase">
            {id}
          </span>
        </div>
        <div className="flex items-center gap-2 border border-border bg-card/45 px-2.5 py-1.5 w-full overflow-hidden">
          <Key className="h-3.5 w-3.5 text-accent shrink-0" />
          <span className="text-[9px] text-slate-500 truncate">
            {uuid}
          </span>
        </div>
      </div>

      {/* Load Status (Warning Badge) */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
          Load Status
        </span>
        <div className="flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-2 text-primary">
          <Activity className="h-3.5 w-3.5 animate-pulse" />
          <span className="font-bold tracking-wider uppercase">
            {loadStatus}
          </span>
        </div>
      </div>

      {/* Zone & Scan Info */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="flex flex-col gap-1.5 border border-border bg-card/25 p-2.5">
          <span className="text-[9px] uppercase tracking-widest text-slate-500">
            Zone
          </span>
          <span className="font-bold text-slate-300 uppercase">
            {zone}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 border border-border bg-card/25 p-2.5">
          <span className="text-[9px] uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" /> Last Scan
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="font-bold text-slate-300">
              {lastScan}
            </span>
            <span className="text-accent font-bold">
              {scanAccuracy}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
