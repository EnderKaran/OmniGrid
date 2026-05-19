import { Target, Bot, LineChart, Cpu } from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    tag: "CAPABILITY // 01",
    title: "Real-time Tracking",
    description: "Monitor every SKU with millisecond precision using our advanced IoT sensor network.",
  },
  {
    icon: Bot,
    tag: "CAPABILITY // 02",
    title: "Robotic Integration",
    description: "Seamlessly orchestrate AGVs and robotic arms from a single, unified dashboard.",
  },
  {
    icon: LineChart,
    tag: "CAPABILITY // 03",
    title: "Predictive Analytics",
    description: "AI-driven forecasting to prevent stockouts and optimize slotting strategies automatically.",
  },
  {
    icon: Cpu,
    tag: "CAPABILITY // 04",
    title: "API First Architecture",
    description: "Built for developers. Extensive documentation and webhooks for custom integrations.",
  },
];

export function Features() {
  return (
    <section id="solutions" className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
      {/* Background Section Accent Grid */}
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none opacity-5">
        <div className="w-[1px] h-full bg-primary" />
        <div className="w-[1px] h-full bg-primary" />
      </div>

      <div className="mb-20 flex flex-col items-center text-center">
        <div className="mb-4 inline-flex items-center gap-2 border border-primary/20 bg-card/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
          Core Capabilities
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl uppercase font-mono">
          Engineered for Throughput
        </h2>
        <p className="mt-4 max-w-2xl text-base text-slate-400 font-sans">
          Eliminate overhead in high-density automated fulfillment nodes with hardware-level telemetry coordination.
        </p>
      </div>

      <div className="grid gap-0 border border-border bg-card/15 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="group flex flex-col border-border p-8 transition-all duration-300 hover:bg-card/40 hover:shadow-2xl hover:shadow-black/50 cursor-pointer border-b md:border-b-0 md:border-r last:border-r-0"
            >
              <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-slate-500 mb-6">
                <span>{feature.tag}</span>
                <span className="text-primary/40 group-hover:text-primary transition-colors">[ ACTIVE ]</span>
              </div>

              <div className="mb-8 inline-flex h-12 w-12 items-center justify-center border border-border bg-background/50 text-primary transition-all group-hover:border-primary/50 group-hover:bg-primary group-hover:text-slate-950">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mb-3 text-lg font-bold text-white uppercase font-mono tracking-wide">
                {feature.title}
              </h3>
              
              <p className="text-sm leading-relaxed text-slate-400 font-sans">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
