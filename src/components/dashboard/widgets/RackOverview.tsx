"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShelfData {
  id: string;
  label: string;
  capacityPercentage: number;
  temperature: number;
  itemCount: number;
}

function getCapacityColor(pct: number) {
  if (pct >= 90) return { bar: "bg-destructive", text: "text-destructive" };
  if (pct >= 70) return { bar: "bg-primary", text: "text-primary" };
  return { bar: "bg-accent", text: "text-accent" };
}

function formatTemperature(temp: number) {
  const sign = temp >= 0 ? "+" : "";
  return `${sign}${temp.toFixed(1)}°C`;
}

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
        "group relative flex flex-col gap-3 p-4 text-left transition-all duration-300 font-mono text-[11px]",
        "bg-card/25 border border-border",
        "hover:bg-card/45 hover:border-primary/30",
        isSelected && [
          "border-primary/50 bg-primary/5",
          "shadow-2xl shadow-black/40",
        ]
      )}
    >
      <div className="relative z-10 flex flex-col gap-3 w-full">
        {/* Header: Label + ID */}
        <div className="flex items-baseline justify-between">
          <span
            className={cn(
              "font-bold uppercase tracking-wider transition-colors",
              isSelected ? "text-primary" : "text-slate-200"
            )}
          >
            {shelf.label}
          </span>
          <span className="text-[9px] text-slate-500">
            {shelf.id}
          </span>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between uppercase">
            <span className="text-[9px] text-slate-500">
              Capacity
            </span>
            <span className={cn("font-bold", cap.text)}>
              {shelf.capacityPercentage}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-card/65 border border-border/40 p-0.5">
            <div
              className={cn(
                "h-full transition-all duration-700 ease-out",
                cap.bar
              )}
              style={{ width: `${shelf.capacityPercentage}%` }}
            />
          </div>
        </div>

        {/* Sensor Data Row */}
        <div className="flex items-center gap-4 pt-1 text-[10px]">
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
            <span className="text-slate-300 font-semibold">
              {formatTemperature(shelf.temperature)}
            </span>
          </div>

          <div className="h-3 w-px bg-border/60" />

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
                rx="0"
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
            <span className="text-slate-300 font-semibold">
              {shelf.itemCount}U
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

export function RackOverview({ shelves = [] }: { shelves?: ShelfData[] }) {
  const [selectedId, setSelectedId] = useState(shelves[1]?.id || shelves[0]?.id);

  const selectedShelf = shelves.find((s) => s.id === selectedId);

  return (
    <div className="flex h-full w-full flex-col gap-5 font-mono text-[11px]">
      {/* Summary bar */}
      <div className="flex items-center gap-6 uppercase">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-slate-100">
            {shelves.length}
          </span>
          <span className="text-[9px] tracking-widest text-slate-500 font-bold">
            Active Shelves
          </span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-slate-100">
            {shelves.reduce((sum, s) => sum + s.itemCount, 0).toLocaleString()}
          </span>
          <span className="text-[9px] tracking-widest text-slate-500 font-bold">
            Total Items
          </span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-accent">
            {shelves.length > 0
              ? Math.round(
                  shelves.reduce((s, sh) => s + sh.capacityPercentage, 0) /
                    shelves.length
                )
              : 0}
            %
          </span>
          <span className="text-[9px] tracking-widest text-slate-500 font-bold">
            Avg Capacity
          </span>
        </div>
      </div>

      {/* Mini-bento shelf grid */}
      <div className="grid flex-1 grid-cols-2 md:grid-cols-3 gap-3">
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
        <div className="flex items-center gap-3 border border-primary/25 bg-primary/5 px-4 py-2.5 uppercase text-[10px]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 bg-primary" />
          </span>
          <span className="font-bold text-primary">
            {selectedShelf.label}
          </span>
          <span className="text-slate-500">
            {selectedShelf.id}
          </span>
          <div className="ml-auto text-slate-400 font-semibold flex gap-2">
            <span>{selectedShelf.itemCount} ITEMS</span>
            <span>·</span>
            <span>{formatTemperature(selectedShelf.temperature)}</span>
            <span>·</span>
            <span
              className={cn(
                "font-bold",
                getCapacityColor(selectedShelf.capacityPercentage).text
              )}
            >
              {selectedShelf.capacityPercentage}% FULL
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
