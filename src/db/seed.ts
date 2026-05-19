import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const db = drizzle(process.env.DATABASE_URL!, { schema });

async function main() {
  console.log("Seed started...");

  // Clear existing data
  console.log("Clearing existing data...");
  await db.delete(schema.orders);
  await db.delete(schema.systemLogs);
  await db.delete(schema.productVariants);
  await db.delete(schema.products);
  await db.delete(schema.shelves);
  await db.delete(schema.racks);
  await db.delete(schema.zones);
  await db.delete(schema.warehouses);

  // Insert Warehouse
  console.log("Inserting warehouse...");
  const [warehouse] = await db.insert(schema.warehouses).values({
    name: "Nexus WMS Central Facility",
    address: "123 Logistics Way",
    city: "Metropolis",
    country: "USA",
  }).returning();

  // Insert Zones
  console.log("Inserting zones...");
  const zones = await db.insert(schema.zones).values([
    { name: "Zone A (Cold Storage)", warehouseId: warehouse.id, description: "Temperature controlled storage" },
    { name: "Zone B (General)", warehouseId: warehouse.id, description: "General merchandise" },
    { name: "Zone C (Hazmat)", warehouseId: warehouse.id, description: "Hazardous materials" },
  ]).returning();

  // Insert Racks & Shelves
  console.log("Inserting racks and shelves...");
  const racks = [];
  for (const zone of zones) {
    for (let r = 1; r <= 2; r++) {
      const [rack] = await db.insert(schema.racks).values({
        name: `Rack ${zone.name.charAt(5)}-${r}`,
        zoneId: zone.id,
        row: r,
        column: 1,
      }).returning();
      racks.push(rack);

      for (let s = 1; s <= 3; s++) {
        // Varying capacity and temperature based on zone
        let temp = 20;
        let cap = Math.floor(Math.random() * 60) + 20;
        if (zone.name.includes("Cold")) {
          temp = -4 + Math.random() * 2;
          cap = Math.floor(Math.random() * 40) + 50; // Cold is more full
        } else if (zone.name.includes("Hazmat")) {
          cap = Math.floor(Math.random() * 30) + 10;
        }

        await db.insert(schema.shelves).values({
          name: `Shelf ${rack.name.split(" ")[1]}-L${s}`,
          rackId: rack.id,
          level: s,
          capacityPercentage: cap,
          temperature: temp,
          weight: Math.floor(Math.random() * 500) + 100,
        });
      }
    }
  }

  // Insert Products
  console.log("Inserting products...");
  const allShelves = await db.select().from(schema.shelves);
  
  if (allShelves.length > 0) {
    const products = await db.insert(schema.products).values([
      { name: "Frozen Peas 500g", sku: "FP-500-01", quantity: 124, shelfId: allShelves[0].id },
      { name: "Logic Gate Arrays", sku: "LGA-90210", quantity: 850, shelfId: allShelves[1].id },
      { name: "Industrial Solvents", sku: "ISO-XX1", quantity: 45, shelfId: allShelves[allShelves.length - 1].id },
      { name: "Standard Pallet Wraps", sku: "PW-STD-00", quantity: 420, shelfId: allShelves[2].id },
    ]).returning();

    // Insert Variants
    console.log("Inserting variants...");
    await db.insert(schema.productVariants).values([
      { name: "Frozen Peas 500g (Organic)", sku: "FP-500-01-ORG", productId: products[0].id, quantity: 50, price: 4.99 },
      { name: "Logic Gate Arrays (Industrial Grade)", sku: "LGA-90210-IND", productId: products[1].id, quantity: 200, price: 15.50 },
    ]);
  }

  // Insert Orders
  console.log("Inserting orders...");
  await db.insert(schema.orders).values([
    { id: "ORD-7821", customer: "Meridian Logistics", items: 24, total: "$12,450", status: "processing", date: "2026-05-19", destination: "Warehouse B" },
    { id: "ORD-7820", customer: "Atlas Supply Co.", items: 8, total: "$3,200", status: "shipped", date: "2026-05-19", destination: "Dock 4" },
    { id: "ORD-7819", customer: "Nordic Components", items: 156, total: "$48,900", status: "delivered", date: "2026-05-18", destination: "Zone A" },
    { id: "ORD-7818", customer: "Quantum Parts Inc.", items: 42, total: "$8,750", status: "pending", date: "2026-05-18", destination: "Staging Area" },
    { id: "ORD-7817", customer: "Prism Electronics", items: 12, total: "$6,100", status: "processing", date: "2026-05-18", destination: "Rack 14" },
    { id: "ORD-7816", customer: "Vertex Materials", items: 200, total: "$22,000", status: "shipped", date: "2026-05-17", destination: "Cold Storage" },
    { id: "ORD-7815", customer: "Echo Systems Ltd.", items: 5, total: "$1,850", status: "delivered", date: "2026-05-17", destination: "Zone C" },
    { id: "ORD-7814", customer: "Helix Manufacturing", items: 67, total: "$15,300", status: "pending", date: "2026-05-16", destination: "Dock 2" },
  ]);

  // Insert System Logs
  console.log("Inserting system logs...");
  await db.insert(schema.systemLogs).values([
    { timestamp: "14:32:01", type: "SUCCESS", message: "Manifest generated for outbound shipment #8492" },
    { timestamp: "14:31:45", type: "INFO", message: "User 'j.doe' initiated zone audit" },
    { timestamp: "14:28:12", type: "WARN", message: "Shelf SH-B-027 capacity approaching upper threshold" },
    { timestamp: "14:15:00", type: "ERROR", message: "Sensor timeout on Zone 3 environmental monitor" },
  ]);

  console.log("Seed completed successfully!");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
