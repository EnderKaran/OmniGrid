import { CARD_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export function BentoCard({ title, className, children }: BentoCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden p-6",
        CARD_STYLES.BASE,
        CARD_STYLES.HOVER,
        CARD_STYLES.GLOW_ACCENT,
        className
      )}
    >
      <div className="relative z-10 flex h-full flex-col">
        <h3 className={CARD_STYLES.HEADER}>{title}</h3>

        <div className="mt-4 flex flex-1 items-center justify-center">
          {children ?? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/[0.06]" />
              <span className="text-sm text-slate-500/60">—</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
