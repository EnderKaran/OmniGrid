import { db } from "@/db";
import { RackOverviewClient } from "@/components/dashboard/RackOverviewClient";
import { notFound } from "next/navigation";

export const revalidate = 0; // force dynamic rendering

export default async function RackOverviewPage({ params }: { params: { id: string } }) {
  const rackId = Number(params.id);

  // Fetch all racks for rack switcher dropdown
  const dbRacks = await db.query.racks.findMany({
    with: {
      zone: true,
      shelves: {
        with: {
          products: true
        }
      }
    }
  });

  if (dbRacks.length === 0) {
    notFound();
  }

  // Find targeted rack or fallback to first
  const targetRack = dbRacks.find((r) => r.id === rackId) || dbRacks[0];

  // Map database details to structured types for the Client component
  const mappedRack = {
    id: targetRack.id,
    name: targetRack.name,
    row: targetRack.row ?? 1,
    column: targetRack.column ?? 1,
    zone: {
      id: targetRack.zone.id,
      name: targetRack.zone.name,
      description: targetRack.zone.description,
    },
    shelves: targetRack.shelves.map((s) => {
      // Calculate capacity percentage based on products stocked vs 1000 threshold
      const totalQuantity = s.products.reduce((sum, p) => sum + p.quantity, 0);
      const capacityPercentage = Math.min(100, Math.round((totalQuantity / 1000) * 100));

      return {
        id: s.id,
        name: s.name,
        capacityPercentage,
        temperature: s.temperature !== null ? Number(s.temperature) : null,
        weight: s.weight !== null ? Number(s.weight) : null,
        products: s.products.map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          quantity: p.quantity,
        })),
      };
    }),
  };

  const allRacksList = dbRacks.map((r) => ({
    id: r.id,
    name: r.name,
  }));

  return <RackOverviewClient rack={mappedRack} allRacks={allRacksList} />;
}
