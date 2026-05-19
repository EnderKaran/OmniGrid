import { db } from "@/db";
import { BentoCard } from "@/components/dashboard/BentoCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DetailedMetadata } from "@/components/dashboard/widgets/DetailedMetadata";
import { EnvironmentMetrics } from "@/components/dashboard/widgets/EnvironmentMetrics";
import { RackOverview } from "@/components/dashboard/widgets/RackOverview";
import { SystemLogs } from "@/components/dashboard/widgets/SystemLogs";
import { TopSKUsActivity } from "@/components/dashboard/widgets/TopSKUsActivity";
import { DASHBOARD_LABELS } from "@/lib/constants";

const { WIDGETS } = DASHBOARD_LABELS;

export const revalidate = 0; // force dynamic rendering

export default async function DashboardPage() {
  // Fetch shelves with rack, zone, and product relations
  const dbShelves = await db.query.shelves.findMany({
    with: {
      products: true,
      rack: {
        with: {
          zone: true,
        },
      },
    },
  });

  // Calculate parameters for RackOverview
  const shelvesData = dbShelves.map((s) => ({
    id: `SH-${s.rack.zone.name.charAt(5)}-0${s.id}`,
    label: s.name,
    capacityPercentage: s.capacityPercentage,
    temperature: s.temperature || 0,
    itemCount: s.products.reduce((acc, p) => acc + p.quantity, 0),
    uuid: `8f4a3b19-c2e7-49f3-a1b4-7d8e9f2a00${s.id}`,
    zone: s.rack.zone.name,
  }));

  // Aggregated Warehouse Metrics for EnvironmentMetrics
  const totalShelves = dbShelves.length || 1;
  const totalItems = dbShelves.reduce(
    (sum, s) => sum + s.products.reduce((acc, p) => acc + p.quantity, 0),
    0
  );
  
  const avgCapacity = Math.round(
    dbShelves.reduce((sum, s) => sum + s.capacityPercentage, 0) / totalShelves
  );
  
  const avgTemp = (
    dbShelves.reduce((sum, s) => sum + (s.temperature || 0), 0) / totalShelves
  ).toFixed(1);
  
  const totalWeight = Math.round(
    dbShelves.reduce((sum, s) => sum + (s.weight || 0), 0) / 100
  );

  const envMetrics = {
    totalCapacityUsed: avgCapacity,
    totalCapacityRaw: totalItems > 1000 ? `${(totalItems / 1000).toFixed(1)}K` : String(totalItems),
    totalCapacityMax: "20K",
    temperature: avgTemp,
    humidity: "42",
    weightLoad: String(totalWeight),
  };

  // Top SKUs sorted by quantity in stock
  const dbProducts = await db.query.products.findMany({
    limit: 3,
    orderBy: (products, { desc }) => [desc(products.quantity)],
  });

  const skusData = dbProducts.map((p) => ({
    id: String(p.id),
    name: p.name,
    sku: p.sku,
    movement: p.quantity,
    trend: (p.quantity > 400 ? ("up" as const) : (p.quantity < 100 ? ("down" as const) : ("neutral" as const))),
  }));

  // Selected shelf details for DetailedMetadata
  const firstShelf = dbShelves[0];
  const metadataData = firstShelf
    ? {
        id: `SH-${firstShelf.rack.zone.name.charAt(5)}-0${firstShelf.id}`,
        uuid: `8f4a3b19-c2e7-49f3-a1b4-7d8e9f2a00${firstShelf.id}`,
        loadStatus: firstShelf.capacityPercentage > 80 ? "Critical Capacity" : (firstShelf.capacityPercentage > 50 ? "Approaching Limit" : "Optimal Capacity"),
        lastScan: "2m ago",
        scanAccuracy: "99.9%",
        zone: firstShelf.rack.zone.name,
      }
    : undefined;

  // System logs from Neon
  const dbLogs = await db.query.systemLogs.findMany({
    limit: 4,
    orderBy: (systemLogs, { desc }) => [desc(systemLogs.id)],
  });

  const logsData = dbLogs.map((l) => ({
    id: String(l.id),
    timestamp: l.timestamp,
    type: l.type as "SUCCESS" | "WARN" | "ERROR" | "INFO",
    message: l.message,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader />

      {/* Stark HUD Scan overlay line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/45 to-transparent" />

      {/* ─── Bento Grid ─── */}
      <main className="relative flex-1 px-6 pb-8 pt-2">
        <div className="mx-auto grid max-w-[1440px] auto-rows-[minmax(180px,_1fr)] grid-cols-4 gap-4">
          {/* Rack Overview — large hero card, top-left */}
          <BentoCard
            title={WIDGETS.RACK_OVERVIEW}
            className="col-span-4 lg:col-span-2 row-span-2 min-h-[400px]"
          >
            <RackOverview shelves={shelvesData} />
          </BentoCard>

          {/* Environment Metrics — top-right wide */}
          <BentoCard
            title={WIDGETS.ENVIRONMENT_METRICS}
            className="col-span-4 lg:col-span-2"
          >
            <EnvironmentMetrics {...envMetrics} />
          </BentoCard>

          {/* Top SKUs Activity — mid-left single */}
          <BentoCard title={WIDGETS.TOP_SKUS_ACTIVITY} className="col-span-4 md:col-span-2 lg:col-span-1">
            <TopSKUsActivity skus={skusData} />
          </BentoCard>

          {/* Detailed Metadata — mid-right single */}
          <BentoCard
            title={WIDGETS.DETAILED_METADATA}
            className="col-span-4 md:col-span-2 lg:col-span-1"
          >
            <DetailedMetadata {...metadataData} />
          </BentoCard>

          {/* System Logs — full-width bottom strip */}
          <BentoCard
            title={WIDGETS.SYSTEM_LOGS}
            className="col-span-4 min-h-[160px] bg-card/10 border-border/80"
          >
            <SystemLogs logs={logsData} />
          </BentoCard>
        </div>
      </main>
    </div>
  );
}
