import { UserButton } from "@clerk/nextjs";
import { DASHBOARD_LABELS } from "@/lib/constants";
import { Terminal } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-border bg-card/10 select-none">
      {/* Logo & Branding */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center border border-primary bg-primary/10 text-primary">
          <Terminal className="h-4.5 w-4.5" />
        </div>
        <div>
          <h1 className="text-[13px] font-bold uppercase tracking-[0.2em] text-white font-mono">
            {DASHBOARD_LABELS.APP_NAME}
          </h1>
          <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 font-mono mt-0.5">
            {DASHBOARD_LABELS.APP_TAGLINE}
          </p>
        </div>
      </div>

      {/* Status & User */}
      <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-widest">
        {/* Live indicator */}
        <div className="flex items-center gap-2 border border-accent/25 bg-accent/10 px-3 py-1.5 text-accent">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 bg-accent" />
          </span>
          <span className="font-bold tracking-widest">
            LIVE_DATA
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8 rounded-none border border-primary/30 ring-2 ring-primary/15 ring-offset-2 ring-offset-background",
            },
          }}
        />
      </div>
    </header>
  );
}
