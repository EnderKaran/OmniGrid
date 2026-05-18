import { ArrowRight, FileText, Zap, Box, ActivitySquare } from "lucide-react";

export function Hero() {
  return (
    <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-32 pb-20 md:flex-row md:pt-40">
      {/* Left Column: Copy & CTAs */}
      <div className="flex w-full flex-col items-start md:w-1/2">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          <span className="text-[10px] font-bold tracking-widest text-cyan-400">
            SYSTEM ONLINE V2.4
          </span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Precision <br />
          Logistics <br />
          <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Automated Age.
          </span>
        </h1>

        <p className="mt-6 max-w-lg text-lg text-slate-400 leading-relaxed">
          Optimize your entire supply chain with our AI-driven Warehouse Management System. Real-time tracking, robotic integration, and predictive analytics designed for high-throughput facilities.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button className="group flex h-12 items-center gap-2 rounded-full bg-cyan-500 px-6 font-semibold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            Initialize Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
            <FileText className="h-4 w-4" />
            Documentation
          </button>
        </div>

        {/* Mini Metrics Bento */}
        <div className="mt-16 grid grid-cols-3 gap-4 w-full max-w-lg">
          <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-slate-500">Latency</span>
              <Zap className="h-3 w-3 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">&lt;12ms</span>
              <span className="text-[10px] font-medium text-cyan-400">OK</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-slate-500">Active Bots</span>
              <Box className="h-3 w-3 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">450+</span>
              <span className="text-[10px] font-medium text-emerald-400">▲ 12%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-slate-500">Efficiency</span>
              <ActivitySquare className="h-3 w-3 text-cyan-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">99.9%</span>
              <span className="text-[10px] font-medium text-cyan-400">TARGET</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: 3D Graphic Placeholder */}
      <div className="relative mt-20 w-full md:mt-0 md:w-1/2 flex justify-center">
        <div className="relative aspect-square w-full max-w-lg rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm flex items-center justify-center">
          <div className="text-slate-500/50 flex flex-col items-center gap-2">
            <Box className="h-16 w-16 opacity-50" />
            <span className="text-sm tracking-widest uppercase">3D Isometric Visual</span>
          </div>

          {/* Floating UI Badges */}
          <div className="absolute top-1/4 -right-6 flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-slate-950/80 px-4 py-2 backdrop-blur-md shadow-xl shadow-black/50">
            <span className="text-xs font-mono text-cyan-400">Sector 7: Optimized</span>
          </div>
          
          <div className="absolute bottom-1/4 -left-6 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-slate-950/80 px-4 py-2 backdrop-blur-md shadow-xl shadow-black/50">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-mono text-emerald-400">AI Node: Active</span>
          </div>
        </div>
      </div>
    </section>
  );
}
