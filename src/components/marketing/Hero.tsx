import { ArrowRight, FileText, Zap, Box, ActivitySquare, Terminal } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-32 pb-20">
      {/* Background crosshair elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[1px] h-full bg-primary/10 absolute left-1/2 -translate-x-1/2" />
        <div className="h-[1px] w-full bg-primary/10 absolute top-1/2 -translate-y-1/2" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
        <div className="mb-8 flex items-center gap-3 border border-primary/20 bg-card/40 px-4 py-2 font-mono">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping bg-accent opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 bg-accent" />
          </span>
          <span className="text-[11px] font-semibold tracking-[0.25em] text-primary">
            TERMINAL // SEC_SYS_ON_V2.4.0
          </span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tighter text-white sm:text-7xl lg:text-9xl uppercase font-mono leading-none select-none">
          Precision <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent">
            LOGISTICS
          </span> <br />
          AUTOMATION.
        </h1>

        <p className="mt-8 max-w-2xl text-base md:text-lg text-slate-400 leading-relaxed font-sans">
          Eliminate slotting inefficiency and telemetry drift. Orchestrate AGVs, monitor smart racks with millisecond latency, and build the physical automation pipeline powered by Neon database precision.
        </p>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link 
            href="/dashboard/analytics" 
            className="group flex h-14 items-center gap-3 border border-primary bg-primary px-8 font-mono text-xs uppercase tracking-widest text-slate-950 font-bold hover:bg-transparent hover:text-primary transition-all duration-300"
          >
            Launch System Console
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button className="flex h-14 items-center gap-3 border border-border bg-card/30 px-8 font-mono text-xs uppercase tracking-widest text-white hover:bg-card/70 hover:border-primary/50 transition-all duration-300">
            <FileText className="h-4 w-4 text-primary" />
            System Specs
          </button>
        </div>
      </div>

      {/* Layered Interactive Frame Mockup with Overlap & Depth */}
      <div className="relative mt-24 w-full max-w-5xl border border-border bg-card/10 p-2 shadow-3xl shadow-black/80">
        <div className="border border-border/60 bg-background/90 p-4 font-mono text-xs text-primary/70 flex justify-between items-center select-none border-b-0">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-accent" />
            <span>CONSOLE_DASHBOARD_PREVIEW.SH</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 border border-primary/40" />
            <div className="w-2.5 h-2.5 border border-primary/40" />
            <div className="w-2.5 h-2.5 border border-primary/40 bg-primary/20" />
          </div>
        </div>

        <div className="relative aspect-[16/9] w-full border border-border bg-card/20 flex flex-col justify-between overflow-hidden">
          {/* Scanning sweep animation line */}
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent scan-indicator pointer-events-none" />

          {/* HUD Tech Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-background/5 select-none pointer-events-none" />

          {/* Grid visual metrics inside visual box */}
          <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end z-10">
            {/* Tech Meter 1 */}
            <div className="border border-border/80 bg-background/90 p-5 flex flex-col gap-2 shadow-2xl hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between border-b border-border pb-1">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">SIGNAL LATENCY</span>
                <Zap className="h-3.5 w-3.5 text-accent animate-pulse" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">0.08ms</span>
                <span className="text-[10px] font-bold text-accent">SECURE</span>
              </div>
            </div>

            {/* Tech Meter 2 */}
            <div className="border border-border/80 bg-background/90 p-5 flex flex-col gap-2 shadow-2xl hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between border-b border-border pb-1">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">BOTS ONLINE</span>
                <Box className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">1,840</span>
                <span className="text-[10px] font-bold text-accent">▲ 98.4%</span>
              </div>
            </div>

            {/* Tech Meter 3 */}
            <div className="border border-border/80 bg-background/90 p-5 flex flex-col gap-2 shadow-2xl hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between border-b border-border pb-1">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">SYSTEM LOAD</span>
                <ActivitySquare className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">12.5%</span>
                <span className="text-[10px] font-bold text-primary">STABLE</span>
              </div>
            </div>
          </div>

          {/* Floating UI tags over the simulation view */}
          <div className="absolute top-8 left-8 flex items-center gap-3 border border-accent/20 bg-background/90 px-4 py-2 font-mono text-[10px] text-accent select-none shadow-lg">
            <span className="h-1.5 w-1.5 bg-accent animate-ping rounded-full" />
            LIVE NODE TELEMETRY // ACTIVE
          </div>

          <div className="absolute top-8 right-8 flex items-center gap-3 border border-primary/20 bg-background/90 px-4 py-2 font-mono text-[10px] text-primary select-none shadow-lg">
            GRID COORDINATES // W-45.92 // N-12.04
          </div>
        </div>
      </div>
    </section>
  );
}
