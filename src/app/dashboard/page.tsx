import { BentoCard } from "@/components/dashboard/BentoCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DetailedMetadata } from "@/components/dashboard/widgets/DetailedMetadata";
import { EnvironmentMetrics } from "@/components/dashboard/widgets/EnvironmentMetrics";
import { RackOverview } from "@/components/dashboard/widgets/RackOverview";
import { SystemLogs } from "@/components/dashboard/widgets/SystemLogs";
import { TopSKUsActivity } from "@/components/dashboard/widgets/TopSKUsActivity";
import { DASHBOARD_LABELS } from "@/lib/constants";

const { WIDGETS } = DASHBOARD_LABELS;

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader />

      {/* Subtle top-edge glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-emerald-500/[0.03] to-transparent" />

      {/* ─── Bento Grid ─── */}
      <main className="relative flex-1 px-6 pb-8 pt-2">
        <div className="mx-auto grid max-w-[1440px] auto-rows-[minmax(180px,_1fr)] grid-cols-4 gap-4">
          {/* Rack Overview — large hero card, top-left */}
          <BentoCard
            title={WIDGETS.RACK_OVERVIEW}
            className="col-span-2 row-span-2 min-h-[400px]"
          >
            <RackOverview />
          </BentoCard>

          {/* Environment Metrics — top-right wide */}
          <BentoCard
            title={WIDGETS.ENVIRONMENT_METRICS}
            className="col-span-2"
          >
            <EnvironmentMetrics />
          </BentoCard>

          {/* Top SKUs Activity — mid-left single */}
          <BentoCard title={WIDGETS.TOP_SKUS_ACTIVITY} className="col-span-1">
            <TopSKUsActivity />
          </BentoCard>

          {/* Detailed Metadata — mid-right single */}
          <BentoCard
            title={WIDGETS.DETAILED_METADATA}
            className="col-span-1"
          >
            <DetailedMetadata />
          </BentoCard>

          {/* System Logs — full-width bottom strip */}
          <BentoCard
            title={WIDGETS.SYSTEM_LOGS}
            className="col-span-4 min-h-[160px] !bg-black/40 !border-white/[0.03]"
          >
            <SystemLogs />
          </BentoCard>
        </div>
      </main>
    </div>
  );
}
