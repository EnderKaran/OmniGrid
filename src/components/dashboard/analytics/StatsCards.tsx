import { Box, Truck, Repeat, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const STATS = [
  {
    title: "Total Processed",
    value: "12,450",
    unit: "Units per day",
    trend: "+12%",
    isPositive: true,
    icon: Box,
  },
  {
    title: "Active Shipments",
    value: "842",
    unit: "Currently in transit",
    trend: "+5%",
    isPositive: true,
    icon: Truck,
  },
  {
    title: "Inventory Turnover",
    value: "4.2x",
    unit: "Monthly velocity",
    trend: "-0.8%",
    isPositive: false,
    icon: Repeat,
  },
  {
    title: "System Uptime",
    value: "99.9%",
    unit: "Last 30 days",
    trend: "-0.1%",
    isPositive: false,
    icon: Server,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-md shadow-lg transition-all duration-300 ease-out hover:bg-slate-900/60 hover:border-white/10 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-slate-400">
                {stat.title}
              </span>
              <Icon className="h-4 w-4 text-cyan-400 opacity-80" />
            </div>
            
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">
                {stat.value}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold flex items-center gap-0.5",
                  stat.isPositive ? "text-emerald-400" : "text-amber-400/90"
                )}
              >
                {stat.isPositive ? "↗" : "↘"} {stat.trend.replace("-", "").replace("+", "")}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{stat.unit}</p>
          </div>
        );
      })}
    </div>
  );
}
