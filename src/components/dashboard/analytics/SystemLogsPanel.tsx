import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const LOGS = [
  { time: "14:32:01", type: "SUCCESS", message: "Manifest generated for Order #991" },
  { time: "14:31:45", type: "INFO", message: "Worker #42 logged into Zone B terminal" },
  { time: "14:30:12", type: "WARN", message: "SKU-992 Low Stock Level ( < 50 units)" },
  { time: "14:28:55", type: "SYS", message: "Pallet #402 scanned at Dock 4" },
  { time: "14:28:10", type: "INFO", message: "Auto-replenishment triggered for Zone A" },
  { time: "14:25:22", type: "SUCCESS", message: "Batch #2204 processed successfully" },
  { time: "14:24:01", type: "SYS", message: "Connection established with IoT Gateway 2" },
  { time: "14:22:15", type: "ERROR", message: "Scanner 04 timeout. Retrying..." },
  { time: "14:22:18", type: "SUCCESS", message: "Scanner 04 back online" },
  { time: "14:20:05", type: "INFO", message: "Shift change detected. Updating records..." },
];

export function SystemLogsPanel() {
  return (
    <aside className="flex h-screen w-full flex-col border-l border-white/5 bg-[#0B1120] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2 text-slate-200">
          <Terminal className="h-4 w-4" />
          <h2 className="text-sm font-bold tracking-widest uppercase">System Logs</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full border border-rose-500/50 bg-rose-500/20" />
          <div className="h-2.5 w-2.5 rounded-full border border-amber-500/50 bg-amber-500/20" />
          <div className="h-2.5 w-2.5 rounded-full border border-emerald-500/50 bg-emerald-500/20" />
        </div>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {LOGS.map((log, idx) => (
          <div key={idx} className="flex gap-3 font-mono text-xs">
            <span className="text-slate-600 shrink-0">[{log.time}]</span>
            <div className="flex flex-col gap-1">
              <span
                className={cn(
                  "font-bold",
                  log.type === "SUCCESS" && "text-emerald-400",
                  log.type === "INFO" && "text-slate-400",
                  log.type === "WARN" && "text-amber-400",
                  log.type === "ERROR" && "text-rose-400",
                  log.type === "SYS" && "text-blue-400"
                )}
              >
                {log.type}:
              </span>
              <span className="text-slate-300 leading-relaxed">
                {log.message}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <input
          type="text"
          placeholder="Type command..."
          className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        />
      </div>
    </aside>
  );
}
