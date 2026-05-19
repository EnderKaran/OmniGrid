import { db } from "@/db";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardClient } from "@/app/dashboard/DashboardClient";

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
    rackId: s.rackId,
    level: s.level || 1,
  }));

  // Top products sorted by quantity
  const dbProducts = await db.query.products.findMany({
    limit: 3,
    orderBy: (products, { desc }) => [desc(products.quantity)],
  });

  const productsData = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    quantity: p.quantity,
  }));

  // System logs from Neon database
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

      {/* Main client-side telemetry dashboard layout wrapper */}
      <main className="relative flex-1 px-6 pb-8 pt-2">
        <DashboardClient
          initialShelves={shelvesData}
          initialProducts={productsData}
          initialLogs={logsData}
        />
      </main>
    </div>
  );
}
