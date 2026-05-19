import { Target, Bot, LineChart, Cpu } from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    title: "Real-time Tracking",
    description: "Monitor every SKU with millisecond precision using our advanced IoT sensor network.",
  },
  {
    icon: Bot,
    title: "Robotic Integration",
    description: "Seamlessly orchestrate AGVs and robotic arms from a single, unified dashboard.",
  },
  {
    icon: LineChart,
    title: "Predictive Analytics",
    description: "AI-driven forecasting to prevent stockouts and optimize slotting strategies automatically.",
  },
  {
    icon: Cpu,
    title: "API First",
    description: "Built for developers. Extensive documentation and webhooks for custom integrations.",
  },
];

export function Features() {
  return (
    <section id="solutions" className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="mb-16 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Core Capabilities
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          Designed for high-throughput automated facilities requiring zero downtime.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="group flex flex-col rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md shadow-lg transition-all duration-300 ease-out hover:border-white/10 hover:bg-slate-900/60 cursor-pointer"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 transition-colors group-hover:bg-cyan-500/20">
                <Icon className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
