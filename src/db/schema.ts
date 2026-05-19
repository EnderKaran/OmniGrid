import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// ──────────────────────────────────────────────
// Warehouse
// ──────────────────────────────────────────────

export const warehouses = pgTable("warehouses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const warehousesRelations = relations(warehouses, ({ many }) => ({
  zones: many(zones),
}));

// ──────────────────────────────────────────────
// Zone
// ──────────────────────────────────────────────

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  warehouseId: integer("warehouse_id")
    .notNull()
    .references(() => warehouses.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const zonesRelations = relations(zones, ({ one, many }) => ({
  warehouse: one(warehouses, {
    fields: [zones.warehouseId],
    references: [warehouses.id],
  }),
  racks: many(racks),
}));

// ──────────────────────────────────────────────
// Rack
// ──────────────────────────────────────────────

export const racks = pgTable("racks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  row: integer("row"),
  column: integer("column"),
  zoneId: integer("zone_id")
    .notNull()
    .references(() => zones.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const racksRelations = relations(racks, ({ one, many }) => ({
  zone: one(zones, {
    fields: [racks.zoneId],
    references: [zones.id],
  }),
  shelves: many(shelves),
}));

// ──────────────────────────────────────────────
// Shelf (with sensor data columns)
// ──────────────────────────────────────────────

export const shelves = pgTable("shelves", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  level: integer("level"),
  capacityPercentage: real("capacity_percentage").notNull().default(0),
  temperature: real("temperature"),
  weight: real("weight"),
  rackId: integer("rack_id")
    .notNull()
    .references(() => racks.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const shelvesRelations = relations(shelves, ({ one, many }) => ({
  rack: one(racks, {
    fields: [shelves.rackId],
    references: [racks.id],
  }),
  products: many(products),
}));

// ──────────────────────────────────────────────
// Product
// ──────────────────────────────────────────────

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  sku: varchar("sku", { length: 100 }).notNull(),
  barcode: varchar("barcode", { length: 100 }),
  quantity: integer("quantity").notNull().default(0),
  shelfId: integer("shelf_id")
    .notNull()
    .references(() => shelves.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  shelf: one(shelves, {
    fields: [products.shelfId],
    references: [shelves.id],
  }),
  variants: many(productVariants),
}));

// ──────────────────────────────────────────────
// ProductVariant
// ──────────────────────────────────────────────

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull(),
  barcode: varchar("barcode", { length: 100 }),
  price: real("price"),
  quantity: integer("quantity").notNull().default(0),
  attributes: text("attributes"),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
);

// ──────────────────────────────────────────────
// Orders
// ──────────────────────────────────────────────

export const orders = pgTable("orders", {
  id: varchar("id", { length: 50 }).primaryKey(),
  customer: varchar("customer", { length: 255 }).notNull(),
  items: integer("items").notNull().default(0),
  total: varchar("total", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  date: varchar("date", { length: 50 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ──────────────────────────────────────────────
// SystemLogs
// ──────────────────────────────────────────────

export const systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  timestamp: varchar("timestamp", { length: 50 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // SUCCESS, WARN, ERROR, INFO
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

