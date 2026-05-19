"use server";

import { auth } from "@clerk/nextjs/server";
import { getPusherServer } from "@/lib/pusher";

interface IoTActionResult {
  success: boolean;
  error?: string;
}

export async function simulatePickOrder(
  shelfId: number,
  shelfName: string
): Promise<IoTActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const pusher = getPusherServer();
    await pusher.trigger("warehouse-global", "iot:pick-triggered", {
      shelfId,
      shelfName,
      timestamp: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to trigger mock pick";
    return {
      success: false,
      error: msg,
    };
  }
}
