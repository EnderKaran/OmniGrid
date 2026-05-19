import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="flex h-full w-full flex-col pt-1 font-mono text-[11px]">
      <ul className="flex flex-col divide-y divide-border/40 w-full">
        {skus.map((item) => (
          <li
            key={item.id}
            className="group flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
          >
            {/* Left: Name & SKU */}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-bold text-slate-200 transition-colors group-hover:text-primary truncate uppercase tracking-wider">
                {item.name}
              </span>
              <span className="text-[9px] text-slate-500">
                {item.sku}
              </span>
            </div>

            {/* Right: Movement & Trend */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="font-bold text-slate-300">
                {Math.abs(item.movement).toLocaleString()}
              </span>
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center border",
                  item.trend === "up" &&
                    "border-accent/30 bg-accent/10 text-accent",
                  item.trend === "down" &&
                    "border-destructive/30 bg-destructive/10 text-destructive",
                  item.trend === "neutral" &&
                    "border-border bg-card/45 text-slate-400"
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
