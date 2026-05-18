import { create } from "zustand";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface ShelfSensorData {
  shelfId: number;
  capacityPercentage: number;
  temperature: number | null;
  weight: number | null;
  updatedAt: string;
}

interface ProductMovement {
  id: string;
  productId: number;
  productName: string;
  fromShelfId: number | null;
  toShelfId: number | null;
  quantity: number;
  type: MovementType;
  timestamp: string;
}

const enum MovementType {
  INBOUND = "INBOUND",
  OUTBOUND = "OUTBOUND",
  TRANSFER = "TRANSFER",
}

interface InventoryState {
  /* Shelf sensor data keyed by shelfId */
  shelfData: Record<number, ShelfSensorData>;

  /* Recent product movements (last N items) */
  recentMovements: ProductMovement[];

  /* Connection status for Pusher */
  isConnected: boolean;

  /* Actions */
  updateShelfData: (data: ShelfSensorData) => void;
  updateShelfDataBatch: (items: ShelfSensorData[]) => void;
  addMovement: (movement: ProductMovement) => void;
  setConnected: (status: boolean) => void;
  reset: () => void;
}

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const MAX_RECENT_MOVEMENTS = 50;

// ──────────────────────────────────────────────
// Store
// ──────────────────────────────────────────────

const initialState = {
  shelfData: {} as Record<number, ShelfSensorData>,
  recentMovements: [] as ProductMovement[],
  isConnected: false,
};

export const useInventoryStore = create<InventoryState>()((set) => ({
  ...initialState,

  updateShelfData: (data) =>
    set((state) => ({
      shelfData: { ...state.shelfData, [data.shelfId]: data },
    })),

  updateShelfDataBatch: (items) =>
    set((state) => {
      const next = { ...state.shelfData };
      for (const item of items) {
        next[item.shelfId] = item;
      }
      return { shelfData: next };
    }),

  addMovement: (movement) =>
    set((state) => ({
      recentMovements: [movement, ...state.recentMovements].slice(
        0,
        MAX_RECENT_MOVEMENTS
      ),
    })),

  setConnected: (status) => set({ isConnected: status }),

  reset: () => set(initialState),
}));

// ──────────────────────────────────────────────
// Selectors (for optimized re-renders)
// ──────────────────────────────────────────────

export const selectShelfById = (shelfId: number) => (state: InventoryState) =>
  state.shelfData[shelfId] ?? null;

export const selectRecentMovements = (state: InventoryState) =>
  state.recentMovements;

export const selectConnectionStatus = (state: InventoryState) =>
  state.isConnected;

// Re-export types
export type { ShelfSensorData, ProductMovement, InventoryState };
export { MovementType };
