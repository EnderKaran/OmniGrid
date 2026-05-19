"use client";

export function CTA() {
  return (
    <section id="cta" className="relative mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
      {/* HUD border enclosure */}
      <div className="border border-border bg-card/20 p-12 relative overflow-hidden">
        {/* Subtle decorative crosshairs */}
        <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-primary/45" />
        <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-primary/45" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-primary/45" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-primary/45" />

        <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
          [ ACCESS_INQUIRY // PIPELINE_INIT ]
        </div>
        
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl uppercase font-mono">
          Initialize Facility Upgrade
        </h2>
        
        <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-slate-400 font-sans">
          Deploy OmniGrid WMS onto your physical nodes. Connect smart telemetry racks, bind automated vehicles, and stream real-time throughput metrics to your control centers.
        </p>

        <form 
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto flex max-w-md items-center justify-center sm:flex-row flex-col gap-3 sm:gap-0 border border-border bg-background p-1.5"
        >
          <input
            type="email"
            placeholder="OPERATOR_EMAIL@WORK.COM"
            required
            className="h-12 w-full border-0 bg-transparent px-4 font-mono text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-0 uppercase"
          />
          <button
            type="submit"
            className="h-12 w-full sm:w-auto shrink-0 bg-primary px-8 font-mono text-xs uppercase tracking-widest text-slate-950 font-bold hover:bg-transparent hover:text-primary transition-all duration-300 border border-transparent hover:border-primary"
          >
            Request Access
          </button>
        </form>
      </div>
    </section>
  );
}
