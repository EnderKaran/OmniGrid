"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// Mock Data
// ──────────────────────────────────────────────

interface ShelfData {
  id: string;
  label: string;
  capacityPercentage: number;
  temperature: number;
  itemCount: number;
}

const MOCK_SHELVES: ShelfData[] = [
  {
    id: "SH-A-014",
    label: "Shelf A",
    capacityPercentage: 72,
    temperature: -4.2,
    itemCount: 124,
  },
  {
    id: "SH-B-027",
    label: "Shelf B",
    capacityPercentage: 91,
    temperature: 2.8,
    itemCount: 203,
  },
  {
    id: "SH-C-009",
    label: "Shelf C",
    capacityPercentage: 34,
    temperature: -1.5,
    itemCount: 57,
  },
  {
    id: "SH-D-041",
    label: "Shelf D",
    capacityPercentage: 58,
    temperature: 5.1,
    itemCount: 89,
  },
  {
    id: "SH-E-018",
    label: "Shelf E",
    capacityPercentage: 97,
    temperature: -2.9,
    itemCount: 312,
  },
  {
    id: "SH-F-033",
    label: "Shelf F",
    capacityPercentage: 12,
    temperature: 0.4,
    itemCount: 18,
  },
];

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function getCapacityColor(pct: number) {
  if (pct >= 90) return { bar: "bg-rose-500", text: "text-rose-400" };
  if (pct >= 70) return { bar: "bg-amber-500", text: "text-amber-400" };
  return { bar: "bg-emerald-500", text: "text-emerald-400" };
}

function formatTemperature(temp: number) {
  const sign = temp >= 0 ? "+" : "";
  return `${sign}${temp.toFixed(1)}°C`;
}

// ──────────────────────────────────────────────
// ShelfCard Component
// ──────────────────────────────────────────────

interface ShelfCardProps {
  shelf: ShelfData;
  isSelected: boolean;
  onSelect: () => void;
}

function ShelfCard({ shelf, isSelected, onSelect }: ShelfCardProps) {
  const cap = getCapacityColor(shelf.capacityPercentage);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl p-4 text-left transition-all duration-300",
        "bg-white/[0.03] border border-white/[0.06]",
        "hover:bg-white/[0.06] hover:border-white/[0.1]",
        isSelected && [
          "border-cyan-500/40 bg-cyan-500/[0.04]",
          "ring-1 ring-cyan-500/30",
          "shadow-[0_0_20px_-4px_rgba(6,182,212,0.15)]",
        ]
      )}
    >
      {/* Selected glow overlay */}
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-cyan-500/[0.06] to-transparent" />
      )}

      <div className="relative z-10 flex flex-col gap-3">
        {/* Header: Label + ID */}
        <div className="flex items-baseline justify-between">
          <span
            className={cn(
              "text-sm font-medium tracking-tight transition-colors",
              isSelected ? "text-cyan-300" : "text-slate-200"
            )}
          >
            {shelf.label}
          </span>
          <span className="text-[10px] font-mono tracking-wider text-slate-500/70">
            {shelf.id}
          </span>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
              Capacity
            </span>
            <span className={cn("text-xs font-semibold tabular-nums", cap.text)}>
              {shelf.capacityPercentage}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                cap.bar
              )}
              style={{ width: `${shelf.capacityPercentage}%` }}
            />
          </div>
        </div>

        {/* Sensor Data Row */}
        <div className="flex items-center gap-4 pt-1">
          {/* Temperature */}
          <div className="flex items-center gap-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-slate-500"
            >
              <path
                d="M6 1v7m0 0a2.5 2.5 0 100 0M4 8V3.5a2 2 0 114 0V8"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xs font-medium tabular-nums text-slate-300">
              {formatTemperature(shelf.temperature)}
            </span>
          </div>

          <div className="h-3 w-px bg-white/[0.06]" />

          {/* Item Count */}
          <div className="flex items-center gap-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-slate-500"
            >
              <rect
                x="1.5"
                y="2.5"
                width="9"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M4 5h4M4 7h2.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xs font-medium tabular-nums text-slate-300">
              {shelf.itemCount}
              <span className="ml-0.5 text-slate-500"> Items</span>
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ──────────────────────────────────────────────
// RackOverview Widget
// ──────────────────────────────────────────────

export function RackOverview({ shelves = [] }: { shelves?: ShelfData[] }) {
  const [selectedId, setSelectedId] = useState(shelves[1]?.id || shelves[0]?.id);

  const selectedShelf = shelves.find((s) => s.id === selectedId);

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Summary bar */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-slate-100">
            {shelves.length}
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
            Active Shelves
          </span>
        </div>
        <div className="h-8 w-px bg-white/[0.06]" />
        <div className="flex flex-col">
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-slate-100">
            {shelves.reduce((sum, s) => sum + s.itemCount, 0).toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
            Total Items
          </span>
        </div>
        <div className="h-8 w-px bg-white/[0.06]" />
        <div className="flex flex-col">
          <span className="text-2xl font-semibold tabular-nums tracking-tight text-emerald-400">
            {shelves.length > 0
              ? Math.round(
                  shelves.reduce((s, sh) => s + sh.capacityPercentage, 0) /
                    shelves.length
                )
              : 0}
            %
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
            Avg Capacity
          </span>
        </div>
      </div>

      {/* Mini-bento shelf grid */}
      <div className="grid flex-1 grid-cols-3 gap-3">
        {shelves.slice(0, 6).map((shelf) => (
          <ShelfCard
            key={shelf.id}
            shelf={shelf}
            isSelected={shelf.id === selectedId}
            onSelect={() => setSelectedId(shelf.id)}
          />
        ))}
      </div>

      {/* Selected shelf detail strip */}
      {selectedShelf && (
        <div className="flex items-center gap-3 rounded-lg bg-cyan-500/[0.04] border border-cyan-500/20 px-4 py-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-500" />
          </span>
          <span className="text-xs font-medium text-cyan-300/90">
            {selectedShelf.label}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {selectedShelf.id}
          </span>
          <div className="ml-auto text-[11px] text-slate-400">
            {selectedShelf.itemCount} items ·{" "}
            {formatTemperature(selectedShelf.temperature)} ·{" "}
            <span
              className={cn(
                "font-medium",
                getCapacityColor(selectedShelf.capacityPercentage).text
              )}
            >
              {selectedShelf.capacityPercentage}% full
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
