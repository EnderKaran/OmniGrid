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

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

type UpdateStockInput = z.infer<typeof updateStockSchema>;
type UpdateShelfSensorInput = z.infer<typeof updateShelfSensorSchema>;

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

    return { success: true };
  } catch {
    return { success: false, error: "Failed to update stock" };
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
