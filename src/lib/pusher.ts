import PusherServer from "pusher";
import PusherClient from "pusher-js";

// ──────────────────────────────────────────────
// Channel & Event Constants
// ──────────────────────────────────────────────

export const PUSHER_CHANNELS = {
  INVENTORY: "inventory",
  WAREHOUSE: (warehouseId: number) => `warehouse-${warehouseId}`,
  SHELF: (shelfId: number) => `shelf-${shelfId}`,
} as const;

export const PUSHER_EVENTS = {
  SHELF_UPDATED: "shelf:updated",
  PRODUCT_MOVED: "product:moved",
  STOCK_CHANGED: "stock:changed",
  SENSOR_DATA: "sensor:data",
} as const;

// ──────────────────────────────────────────────
// Server-side Pusher instance (singleton)
// ──────────────────────────────────────────────

let pusherServerInstance: PusherServer | null = null;

export function getPusherServer(): PusherServer | null {
  if (pusherServerInstance) return pusherServerInstance;

  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER;

  if (!appId || !key || !secret || !cluster) {
    console.warn("Pusher server-side credentials are not configured. Real-time telemetry broadcast is disabled.");
    return null;
  }

  pusherServerInstance = new PusherServer({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });

  return pusherServerInstance;
}

// ──────────────────────────────────────────────
// Client-side Pusher instance (singleton)
// ──────────────────────────────────────────────

let pusherClientInstance: PusherClient | null = null;

export function getPusherClient(): PusherClient | null {
  if (pusherClientInstance) return pusherClientInstance;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    console.warn("Pusher client-side keys are not configured. Real-time telemetry is disabled.");
    return null;
  }

  pusherClientInstance = new PusherClient(key, { cluster });

  return pusherClientInstance;
}
