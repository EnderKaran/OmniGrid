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
  const racks: (typeof schema.racks.$inferSelect)[] = [];
  const allShelves: (typeof schema.shelves.$inferSelect)[] = [];
  
  // Let's create more racks per zone to accommodate 500+ products
  for (const zone of zones) {
    for (let r = 1; r <= 4; r++) {
      const [rack] = await db.insert(schema.racks).values({
        name: `Rack ${zone.name.charAt(5)}-${r}`,
        zoneId: zone.id,
        row: r,
        column: 1,
      }).returning();
      racks.push(rack);

      for (let s = 1; s <= 5; s++) {
        let temp = 20;
        let cap = Math.floor(Math.random() * 60) + 20;
        if (zone.name.includes("Cold")) {
          temp = -4 + Math.random() * 2;
          cap = Math.floor(Math.random() * 40) + 50;
        } else if (zone.name.includes("Hazmat")) {
          cap = Math.floor(Math.random() * 30) + 10;
        }

        const [shelf] = await db.insert(schema.shelves).values({
          name: `Shelf ${rack.name.split(" ")[1]}-L${s}`,
          rackId: rack.id,
          level: s,
          capacityPercentage: cap,
          temperature: temp,
          weight: Math.floor(Math.random() * 500) + 100,
        }).returning();
        allShelves.push(shelf);
      }
    }
  }

  // Insert 500+ Products!
  console.log("Generating 520 high-performance products...");
  const productValues = [];
  
  const productTemplates = [
    { name: "Optik Sensör Seti", skuPrefix: "SEN-OPT", category: "Electronics" },
    { name: "Sıcaklık Transduseri", skuPrefix: "SEN-TMP", category: "Electronics" },
    { name: "Nem Kalibratör Probu", skuPrefix: "SEN-HUM", category: "Electronics" },
    { name: "Lityum İyon Batarya Hücresi", skuPrefix: "BAT-LIO", category: "Electronics" },
    { name: "Kondansatör Paketi 10uF", skuPrefix: "CAP-10U", category: "Electronics" },
    { name: "Akıllı RFID Etiket Şeridi", skuPrefix: "TAG-RFI", category: "Electronics" },
    { name: "Mikrodenetleyici Anakart", skuPrefix: "MCU-BRD", category: "Electronics" },
    { name: "Lazer Diyot Modülü", skuPrefix: "LAS-DIO", category: "Electronics" },
    { name: "Akselerometre Çipi", skuPrefix: "ACC-CHP", category: "Electronics" },
    { name: "Gerilim Regülatörü", skuPrefix: "VOL-REG", category: "Electronics" },
    
    { name: "Endüstriyel Solvent Solüsyonu", skuPrefix: "HAZ-SOL", category: "Hazmat" },
    { name: "Saf Etanol Yakıtı 5L", skuPrefix: "HAZ-ETH", category: "Hazmat" },
    { name: "Reaktif Epoksi Yapıştırıcı", skuPrefix: "HAZ-EPO", category: "Hazmat" },
    { name: "Kurşun Asit Akümülatörü", skuPrefix: "HAZ-LAA", category: "Hazmat" },
    { name: "Argon Gaz Tüpü 20L", skuPrefix: "HAZ-ARG", category: "Hazmat" },
    { name: "Kostik Soda Flakeleri", skuPrefix: "HAZ-SOD", category: "Hazmat" },
    { name: "Hidroklorik Asit Bidonu", skuPrefix: "HAZ-HCL", category: "Hazmat" },
    { name: "Basınçlı Nitrojen Tankı", skuPrefix: "HAZ-NIT", category: "Hazmat" },
    
    { name: "Dondurulmuş Organik Bezelye 500g", skuPrefix: "CLD-PEA", category: "Cold" },
    { name: "Kriyojenik Medikal Aşı Tüpü", skuPrefix: "CLD-VAC", category: "Cold" },
    { name: "Termal Jel Buz Aküsü", skuPrefix: "CLD-ICE", category: "Cold" },
    { name: "Dondurulmuş Atlantik Somonu", skuPrefix: "CLD-SAL", category: "Cold" },
    { name: "Dondurulmuş Yaban Mersini", skuPrefix: "CLD-BLU", category: "Cold" },
    { name: "Hassas Enzim Sıvı Kiti", skuPrefix: "CLD-ENZ", category: "Cold" },
    { name: "Sıvı Azot Soğutma Kabı", skuPrefix: "CLD-LN2", category: "Cold" },
    
    { name: "Ağır Hizmet Ahşap Palet", skuPrefix: "PKG-PLT", category: "General" },
    { name: "Polietilen Patpat Naylon 100m", skuPrefix: "PKG-BUB", category: "General" },
    { name: "Streç Film Sarım Rulosu", skuPrefix: "PKG-STR", category: "General" },
    { name: "Çelik Güçlendirilmiş Raf Profili", skuPrefix: "PKG-STL", category: "General" },
    { name: "Koli Bantlama Makinesi", skuPrefix: "PKG-TAP", category: "General" },
    { name: "Oluklu Mukavva Koli (Büyük)", skuPrefix: "PKG-BOX", category: "General" },
    { name: "Kargo Çemberleme Şeridi 500m", skuPrefix: "PKG-BAN", category: "General" }
  ];

  for (let i = 1; i <= 520; i++) {
    const template = productTemplates[i % productTemplates.length];
    
    // Distribute based on category to correct shelf zone
    let targetShelf = allShelves[i % allShelves.length];
    if (template.category === "Cold") {
      const coldShelves = allShelves.filter(s => {
        const rack = racks.find(r => r.id === s.rackId);
        const zone = zones.find(z => z.id === rack?.zoneId);
        return zone?.name.includes("Cold");
      });
      if (coldShelves.length > 0) targetShelf = coldShelves[i % coldShelves.length];
    } else if (template.category === "Hazmat") {
      const hazmatShelves = allShelves.filter(s => {
        const rack = racks.find(r => r.id === s.rackId);
        const zone = zones.find(z => z.id === rack?.zoneId);
        return zone?.name.includes("Hazmat");
      });
      if (hazmatShelves.length > 0) targetShelf = hazmatShelves[i % hazmatShelves.length];
    } else {
      const generalShelves = allShelves.filter(s => {
        const rack = racks.find(r => r.id === s.rackId);
        const zone = zones.find(z => z.id === rack?.zoneId);
        return zone?.name.includes("General");
      });
      if (generalShelves.length > 0) targetShelf = generalShelves[i % generalShelves.length];
    }

    const serialNum = String(1000 + i);
    const sku = `${template.skuPrefix}-${serialNum}`;
    const barcode = `PROD-${sku}`;
    
    productValues.push({
      name: `${template.name} #${serialNum}`,
      description: `${template.name} serisi, endüstriyel kalite standartlarına uygun lojistik ürün. Seri numarası ${serialNum}.`,
      sku: sku,
      barcode: barcode,
      quantity: Math.floor(Math.random() * 450) + 10,
      shelfId: targetShelf.id
    });
  }

  // Insert in batches of 100 for safety and speed
  console.log("Saving products to Neon database...");
  for (let i = 0; i < productValues.length; i += 100) {
    const batch = productValues.slice(i, i + 100);
    await db.insert(schema.products).values(batch);
  }
  console.log(`Successfully loaded ${productValues.length} products!`);

  // Insert some orders
  console.log("Inserting orders...");
  await db.insert(schema.orders).values([
    { id: "ORD-7821", customer: "Meridian Logistics", items: 24, total: "$12,450", status: "processing", date: "2026-05-19", destination: "Warehouse B" },
    { id: "ORD-7820", customer: "Atlas Supply Co.", items: 8, total: "$3,200", status: "shipped", date: "2026-05-19", destination: "Dock 4" },
    { id: "ORD-7819", customer: "Apex Industrial Corp.", items: 120, total: "$84,200", status: "pending", date: "2026-05-19", destination: "Zone C Gate 2" }
  ]);

  // Insert some initial system logs
  console.log("Inserting system logs...");
  await db.insert(schema.systemLogs).values([
    { timestamp: "13:21:40", type: "INFO", message: "OmniGrid WMS Real-Time Stock Database Sync initialized." },
    { timestamp: "13:22:05", type: "SUCCESS", message: "Neon PostgreSQL database seed loaded successfully: 500+ records updated." }
  ]);

  console.log("Seed complete!");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
