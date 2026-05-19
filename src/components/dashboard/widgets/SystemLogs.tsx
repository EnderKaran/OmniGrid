import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="flex h-full w-full flex-col font-mono text-[11px] leading-relaxed">
      <div className="mb-4 flex items-center gap-2 text-slate-500 pb-2 border-b border-border/40 select-none">
        <Terminal className="h-3.5 w-3.5 text-primary" />
        <span className="uppercase tracking-widest text-[9px] font-bold">
          LIVE_SHELL // CONSOLE_STREAM
        </span>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto max-h-[140px]">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 py-0.5">
            <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
            <span
              className={cn(
                "shrink-0 font-bold w-16",
                log.type === "SUCCESS" && "text-accent",
                log.type === "WARN" && "text-primary",
                log.type === "ERROR" && "text-destructive",
                log.type === "INFO" && "text-slate-400"
              )}
            >
              {log.type}
            </span>
            <span className="text-slate-300 break-all select-all">
              {log.message}
            </span>
          </div>
        ))}
        {/* Blinking cursor effect */}
        <div className="mt-1.5 flex items-center gap-2 select-none">
          <span className="text-primary font-bold">❯</span>
          <span className="h-3 w-1.5 animate-pulse bg-primary" />
        </div>
      </div>
    </div>
  );
}
