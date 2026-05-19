import { Droplets, Thermometer, Weight } from "lucide-react";

interface EnvironmentMetricsProps {
  totalCapacityUsed?: number;
  totalCapacityRaw?: string;
  totalCapacityMax?: string;
  temperature?: string;
  humidity?: string;
  weightLoad?: string;
}

export function EnvironmentMetrics({
  totalCapacityUsed = 78,
  totalCapacityRaw = "1.2M",
  totalCapacityMax = "1.5M",
  temperature = "-3.8",
  humidity = "42",
  weightLoad = "840",
}: EnvironmentMetricsProps) {
  return (
    <div className="flex h-full w-full flex-col gap-6 pt-2 font-mono text-[11px]">
      {/* 1. Asymmetric Total Capacity Progress */}
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between uppercase">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
              Warehouse Capacity
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">
                {totalCapacityRaw}
              </span>
              <span className="text-[9px] text-slate-500">
                / {totalCapacityMax} UNITS
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-accent">
            {totalCapacityUsed}% USED
          </span>
        </div>

        {/* Custom sharp brutalist industrial tick bar */}
        <div className="relative h-4 w-full bg-card/45 border border-border p-0.5 flex">
          <div
            className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-1000 ease-out"
            style={{ width: `${totalCapacityUsed}%` }}
          />
          {/* Vertical coordinate indicator */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-accent transition-all duration-1000 ease-out"
            style={{ left: `${totalCapacityUsed}%` }}
          />
        </div>
      </div>

      {/* 2. Environmental Grid (2-columns) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="group relative flex items-center gap-3 border border-border bg-card/25 p-3 hover:border-primary/45 transition-colors">
          <div className="flex h-8 w-8 items-center justify-center border border-primary bg-primary/10 text-primary">
            <Thermometer className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
              Temperature
            </span>
            <span className="text-sm font-bold text-white mt-0.5">
              {temperature}°C
            </span>
          </div>
        </div>

        {/* Humidity */}
        <div className="group relative flex items-center gap-3 border border-border bg-card/25 p-3 hover:border-primary/45 transition-colors">
          <div className="flex h-8 w-8 items-center justify-center border border-accent bg-accent/10 text-accent">
            <Droplets className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
              Humidity
            </span>
            <span className="text-sm font-bold text-white mt-0.5">
              {humidity}%
            </span>
          </div>
        </div>

        {/* Total Weight Load (Spans 2 cols for asymmetry) */}
        <div className="col-span-2 group relative flex items-center justify-between border border-border bg-card/25 p-3 hover:border-primary/45 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border border-primary bg-primary/10 text-primary">
              <Weight className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                Floor Load (EST.)
              </span>
              <span className="text-sm font-bold text-white mt-0.5">
                {weightLoad} TONS
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end uppercase">
            <span className="text-[9px] text-slate-500">Node Status</span>
            <span className="text-[10px] text-accent font-bold mt-0.5">OPTIMAL (72%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
