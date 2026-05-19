import { db } from "@/db";
import { InventoryClient, InventoryItem, ItemStatus } from "@/components/dashboard/InventoryClient";

export const revalidate = 0; // force dynamic rendering

export default async function InventoryCommandGrid() {
  const dbProducts = await db.query.products.findMany({
    with: {
      shelf: {
        with: {
          rack: {
            with: {
              zone: true
            }
          }
        }
      }
    }
  });

  const dbShelves = await db.query.shelves.findMany({
    with: {
      rack: {
        with: {
          zone: true
        }
      }
    }
  });

  const inventoryData: InventoryItem[] = dbProducts.map((p) => {
    let locationCode = "GEN-01";
    let zoneName = "General";
    if (p.shelf?.rack?.zone) {
      const zoneLetter = p.shelf.rack.zone.name.includes("Cold") ? "A" : (p.shelf.rack.zone.name.includes("Hazmat") ? "C" : "B");
      locationCode = `${zoneLetter}-0${p.shelf.rack.row}-0${p.shelf.level}`;
      zoneName = p.shelf.rack.zone.name;
    }

    const isLowStock = p.quantity < 100;
    const isCritical = p.quantity < 50;
    const status: ItemStatus = isCritical ? "critical" : (isLowStock ? "warning" : "normal");

    return {
      id: String(p.id),
      name: p.name,
      loc: locationCode,
      stock: String(p.quantity).padStart(4, "0"),
      unit: p.quantity > 200 ? "UNITS" : "BOXES",
      sku: p.sku,
      trend: p.quantity < 50 ? "REORDER" : "Stable",
      status,
      chartData: [40, 30, p.quantity > 100 ? 50 : 20, p.quantity > 200 ? 60 : 30, p.quantity, p.quantity, p.quantity],
      shelfId: p.shelfId,
      zoneName,
    };
  });

  const shelvesList = dbShelves.map((s) => ({
    id: s.id,
    name: `${s.name} (${s.rack.zone.name})`,
  }));

  return <InventoryClient items={inventoryData} shelves={shelvesList} />;
}
