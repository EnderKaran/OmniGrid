import { Terminal } from "lucide-react";

import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// Mock Data
// ──────────────────────────────────────────────

interface SystemLog {
  id: string;
  timestamp: string;
  type: "SUCCESS" | "WARN" | "ERROR" | "INFO";
  message: string;
}

const MOCK_LOGS: SystemLog[] = [
  {
    id: "1",
    timestamp: "14:32:01",
    type: "SUCCESS",
    message: "Manifest generated for outbound shipment #8492",
  },
  {
    id: "2",
    timestamp: "14:31:45",
    type: "INFO",
    message: "User 'j.doe' initiated zone audit",
  },
  {
    id: "3",
    timestamp: "14:28:12",
    type: "WARN",
    message: "Shelf SH-B-027 capacity approaching upper threshold",
  },
  {
    id: "4",
    timestamp: "14:15:00",
    type: "ERROR",
    message: "Sensor timeout on Zone 3 environmental monitor",
  },
];

// ──────────────────────────────────────────────
// SystemLogs Widget
// ──────────────────────────────────────────────

export function SystemLogs() {
  return (
    <div className="flex h-full w-full flex-col font-mono text-xs">
      <div className="mb-3 flex items-center gap-2 text-slate-500">
        <Terminal className="h-3.5 w-3.5" />
        <span className="uppercase tracking-widest text-[10px]">
          Live Terminal
        </span>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto">
        {MOCK_LOGS.map((log) => (
          <div key={log.id} className="flex items-start gap-3 py-1">
            <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
            <span
              className={cn(
                "shrink-0 font-semibold w-16",
                log.type === "SUCCESS" && "text-emerald-400/80",
                log.type === "WARN" && "text-amber-400/80",
                log.type === "ERROR" && "text-rose-400/80",
                log.type === "INFO" && "text-cyan-400/80"
              )}
            >
              {log.type}
            </span>
            <span className="text-slate-300 break-words line-clamp-1 group-hover:line-clamp-none transition-all">
              {log.message}
            </span>
          </div>
        ))}
        {/* Blinking cursor effect */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-emerald-400/80">❯</span>
          <span className="h-3 w-1.5 animate-pulse bg-slate-500" />
        </div>
      </div>
    </div>
  );
}
