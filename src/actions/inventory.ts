"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { products, shelves } from "@/db/schema";
import { getPusherServer, PUSHER_CHANNELS, PUSHER_EVENTS } from "@/lib/pusher";

// ──────────────────────────────────────────────
// Validation Schemas
// ──────────────────────────────────────────────

const updateStockSchema = z.object({
  productId: z.number().positive(),
  shelfId: z.number().positive(),
  quantityChange: z.number(),
  reason: z.string().min(1),
});

const updateShelfSensorSchema = z.object({
  shelfId: z.number().positive(),
  capacityPercentage: z.number().min(0).max(100),
  temperature: z.number().nullable(),
  weight: z.number().min(0).nullable(),
});

const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  barcode: z.string().optional(),
  quantity: z.number().nonnegative(),
  shelfId: z.number().positive(),
  description: z.string().optional(),
});

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

type UpdateStockInput = z.infer<typeof updateStockSchema>;
type UpdateShelfSensorInput = z.infer<typeof updateShelfSensorSchema>;
type CreateProductInput = z.infer<typeof createProductSchema>;

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ──────────────────────────────────────────────
// Emerald Pulse — Stock Change Action
// ──────────────────────────────────────────────

export async function updateStock(
  input: UpdateStockInput
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const parsed = updateStockSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const { productId, shelfId, quantityChange, reason } = parsed.data;

  try {
    /* --- DB Update --- */
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) return { success: false, error: "Product not found" };

    const newQuantity = product.quantity + quantityChange;
    if (newQuantity < 0) {
      return { success: false, error: "Insufficient stock" };
    }

    await db
      .update(products)
      .set({ quantity: newQuantity, updatedAt: new Date() })
      .where(eq(products.id, productId));

    /* --- Emerald Pulse: broadcast via Pusher --- */
    const pusher = getPusherServer();

    await pusher.trigger(PUSHER_CHANNELS.INVENTORY, PUSHER_EVENTS.STOCK_CHANGED, {
      productId,
      productName: product.name,
      shelfId,
      previousQuantity: product.quantity,
      newQuantity,
      quantityChange,
      reason,
      triggeredBy: userId,
      timestamp: new Date().toISOString(),
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/inventory");

    return { success: true };
  } catch {
    return { success: false, error: "Failed to update stock" };
  }
}

// ──────────────────────────────────────────────
// Emerald Pulse — Create Product Action
// ──────────────────────────────────────────────

export async function createProduct(
  input: CreateProductInput
): Promise<ActionResult<{ id: number }>> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const { name, sku, barcode, quantity, shelfId, description } = parsed.data;

  try {
    const [newProduct] = await db
      .insert(products)
      .values({
        name,
        sku,
        barcode: barcode || `BAR-${sku}`,
        quantity,
        shelfId,
        description: description || `${name} endüstriyel lojistik ürün.`,
      })
      .returning();

    /* --- Emerald Pulse: broadcast --- */
    const pusher = getPusherServer();
    await pusher.trigger(PUSHER_CHANNELS.INVENTORY, PUSHER_EVENTS.STOCK_CHANGED, {
      productId: newProduct.id,
      productName: newProduct.name,
      shelfId,
      previousQuantity: 0,
      newQuantity: quantity,
      quantityChange: quantity,
      reason: "Initial Stock Ingest",
      triggeredBy: userId,
      timestamp: new Date().toISOString(),
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/inventory");

    return { success: true, data: { id: newProduct.id } };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create product";
    return { success: false, error: msg };
  }
}

// ──────────────────────────────────────────────
// Emerald Pulse — Shelf Sensor Update Action
// ──────────────────────────────────────────────

export async function updateShelfSensor(
  input: UpdateShelfSensorInput
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const parsed = updateShelfSensorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const { shelfId, capacityPercentage, temperature, weight } = parsed.data;

  try {
    await db
      .update(shelves)
      .set({
        capacityPercentage,
        temperature,
        weight,
        updatedAt: new Date(),
      })
      .where(eq(shelves.id, shelfId));

    /* --- Emerald Pulse: broadcast sensor data --- */
    const pusher = getPusherServer();

    await pusher.trigger(
      PUSHER_CHANNELS.SHELF(shelfId),
      PUSHER_EVENTS.SENSOR_DATA,
      {
        shelfId,
        capacityPercentage,
        temperature,
        weight,
        updatedAt: new Date().toISOString(),
      }
    );

    return { success: true };
  } catch {
    return { success: false, error: "Failed to update sensor data" };
  }
}
