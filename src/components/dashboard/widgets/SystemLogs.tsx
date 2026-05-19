import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// SystemLogs Widget
// ──────────────────────────────────────────────

export interface SystemLog {
  id: string;
  timestamp: string;
  type: "SUCCESS" | "WARN" | "ERROR" | "INFO";
  message: string;
}

interface SystemLogsProps {
  logs?: SystemLog[];
}

export function SystemLogs({ logs = [] }: SystemLogsProps) {
  return (
    <div className="flex h-full w-full flex-col font-mono text-xs">
      <div className="mb-3 flex items-center gap-2 text-slate-500">
        <Terminal className="h-3.5 w-3.5" />
        <span className="uppercase tracking-widest text-[10px]">
          Live Terminal
        </span>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto">
        {logs.map((log) => (
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
