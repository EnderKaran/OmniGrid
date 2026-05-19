import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

async function runBenchmark() {
  const db = drizzle(process.env.DATABASE_URL!, { schema });

  console.log("=========================================");
  console.log("📊 OMNIGRID RELATION PERFORMANCE TEST");
  console.log("=========================================");

  // 1. Warm-up
  console.log("Warming up database connection...");
  await db.select().from(schema.warehouses).limit(1);

  // 2. Measure Join Query (Standard SQL Join)
  console.log("\n1. Measuring Standard SQL-style Joins (6 Tables)...");
  const joinStart = performance.now();
  const joinResults = await db
    .select()
    .from(schema.warehouses)
    .leftJoin(schema.zones, eq(schema.warehouses.id, schema.zones.warehouseId))
    .leftJoin(schema.racks, eq(schema.zones.id, schema.racks.zoneId))
    .leftJoin(schema.shelves, eq(schema.racks.id, schema.shelves.rackId))
    .leftJoin(schema.products, eq(schema.shelves.id, schema.products.shelfId))
    .leftJoin(
      schema.productVariants,
      eq(schema.products.id, schema.productVariants.productId)
    )
    .limit(100);
  const joinEnd = performance.now();
  const joinTime = joinEnd - joinStart;
  console.log(`✓ Standard Joins fetched ${joinResults.length} records in ${joinTime.toFixed(2)}ms`);

  // 3. Measure Relational Nested Query (Drizzle Relational API)
  console.log("\n2. Measuring Drizzle Relational API Nested Query...");
  const relStart = performance.now();
  const relationalResults = await db.query.warehouses.findMany({
    with: {
      zones: {
        with: {
          racks: {
            with: {
              shelves: {
                with: {
                  products: {
                    with: {
                      variants: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    limit: 10,
  });
  const relEnd = performance.now();
  const relTime = relEnd - relStart;
  console.log(`✓ Relational API fetched ${relationalResults.length} nested warehouses in ${relTime.toFixed(2)}ms`);

  console.log("\n=========================================");
  console.log("📊 PERFORMANCE AUDIT SUMMARY");
  console.log("=========================================");
  console.log(`Standard 6-Table Join Time: ${joinTime.toFixed(2)}ms`);
  console.log(`Nested Relational Query Time: ${relTime.toFixed(2)}ms`);
  
  if (joinTime < 100 && relTime < 150) {
    console.log("\n🚀 SUCCESS: Query latency is outstanding! (Under performance thresholds)");
  } else {
    console.log("\n⚠️ WARNING: Latency is higher than expected. Check query plans or network routing.");
  }
  console.log("=========================================");
}

runBenchmark().catch((err) => {
  console.error("Benchmark failed:", err);
  process.exit(1);
});
