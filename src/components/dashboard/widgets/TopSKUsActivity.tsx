import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// TopSKUsActivity Widget
// ──────────────────────────────────────────────

export interface SkuActivity {
  id: string;
  name: string;
  sku: string;
  movement: number;
  trend: "up" | "down" | "neutral";
}

interface TopSKUsActivityProps {
  skus?: SkuActivity[];
}

export function TopSKUsActivity({ skus = [] }: TopSKUsActivityProps) {
  return (
    <div className="flex h-full w-full flex-col pt-1">
      <ul className="flex flex-col divide-y divide-white/[0.05]">
        {skus.map((item) => (
          <li
            key={item.id}
            className="group flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
          >
            {/* Left: Name & SKU */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-slate-200 transition-colors group-hover:text-white">
                {item.name}
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                {item.sku}
              </span>
            </div>

            {/* Right: Movement & Trend */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold tabular-nums text-slate-300">
                {Math.abs(item.movement).toLocaleString()}
              </span>
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-md border",
                  item.trend === "up" &&
                    "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-400",
                  item.trend === "down" &&
                    "border-rose-500/20 bg-rose-500/[0.05] text-rose-400",
                  item.trend === "neutral" &&
                    "border-slate-500/20 bg-slate-500/[0.05] text-slate-400"
                )}
              >
                {item.trend === "up" && <TrendingUp className="h-3 w-3" />}
                {item.trend === "down" && <TrendingDown className="h-3 w-3" />}
                {item.trend === "neutral" && <Minus className="h-3 w-3" />}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
