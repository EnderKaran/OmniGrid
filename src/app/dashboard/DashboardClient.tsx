"use client";

import { useEffect, useState } from "react";
import { getPusherClient } from "@/lib/pusher";
import { BentoCard } from "@/components/dashboard/BentoCard";
import { EnvironmentMetrics } from "@/components/dashboard/widgets/EnvironmentMetrics";
import { RackOverview } from "@/components/dashboard/widgets/RackOverview";
import { DetailedMetadata } from "@/components/dashboard/widgets/DetailedMetadata";
import { TopSKUsActivity } from "@/components/dashboard/widgets/TopSKUsActivity";
import { SystemLogs } from "@/components/dashboard/widgets/SystemLogs";
import { TimeMachineHUD } from "@/components/dashboard/TimeMachineHUD";
import { DASHBOARD_LABELS } from "@/lib/constants";

const { WIDGETS } = DASHBOARD_LABELS;

interface DashboardClientProps {
  initialShelves: Array<{
    id: string;
    label: string;
    capacityPercentage: number;
    temperature: number;
    itemCount: number;
    uuid: string;
    zone: string;
    rackId: number;
    level: number;
  }>;
  initialProducts: Array<{
    id: number;
    name: string;
    sku: string;
    quantity: number;
  }>;
  initialLogs: Array<{
    id: string;
    timestamp: string;
    type: "SUCCESS" | "WARN" | "ERROR" | "INFO";
    message: string;
  }>;
}

export function DashboardClient({
  initialShelves,
  initialProducts,
  initialLogs,
}: DashboardClientProps) {
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [liveInterrupt, setLiveInterrupt] = useState<{ shelfName: string; timestamp: string } | null>(null);
  
  // Real-time Pick guidance signal tracking (for RackOverview when in LIVE mode)
  const [activePickSignal, setActivePickSignal] = useState<{ shelfId: number; shelfName: string } | null>(null);

  // Subscribe to real-time Pusher channel
  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher) return;

    const channel = pusher.subscribe("warehouse-global");
    
    channel.bind("iot:pick-triggered", (data: { shelfId: number; shelfName: string }) => {
      const nowString = new Date().toLocaleTimeString();
      
      if (timeOffset === 0) {
        // We are on LIVE mode - pass the pick trigger directly to RackOverview!
        setActivePickSignal({ shelfId: data.shelfId, shelfName: data.shelfName });
      } else {
        // We are in historical PLAYBACK mode - trigger the high-voltage red HUD overlay interrupt warning!
        setLiveInterrupt({
          shelfName: data.shelfName,
          timestamp: nowString,
        });
      }
    });

    return () => {
      channel.unbind("iot:pick-triggered");
      pusher.unsubscribe("warehouse-global");
    };
  }, [timeOffset]);

  // Handle warping back to LIVE
  const handleWarpToLive = () => {
    setTimeOffset(0);
    setIsPlaying(false);
    setLiveInterrupt(null);
  };

  // ────────────────────────────────────────────────────────
  // DETERMINISTIC TELEMETRY HISTORY GENERATION ENGINE
  // ────────────────────────────────────────────────────────
  
  // 1. Recalculate shelves state based on timeOffset (hours)
  const shelvesData = initialShelves.map((s) => {
    if (timeOffset === 0) {
      return s; // actual database live state
    }
    
    // Generate deterministic variations using prime multipliers
    const seed = Number(s.rackId) * 31 + Number(s.level) * 17 + timeOffset * 13;
    const capacityNoise = Math.sin(seed) * 15 + Math.cos(seed * 0.6) * 6;
    const tempNoise = Math.cos(seed * 1.2) * 1.8;
    const countNoise = Math.sin(seed * 0.8) * 12;

    const capacityPercentage = Math.max(8, Math.min(96, Math.round(s.capacityPercentage + capacityNoise)));
    const temperature = Math.round((s.temperature + tempNoise) * 10) / 10;
    const itemCount = Math.max(20, Math.round(s.itemCount + countNoise));

    return {
      ...s,
      capacityPercentage,
      temperature,
      itemCount,
    };
  });

  // 2. Aggregate Environment Metrics matching history
  const totalShelves = shelvesData.length || 1;
  const totalItems = shelvesData.reduce((sum, s) => sum + s.itemCount, 0);
  const avgCapacity = Math.round(
    shelvesData.reduce((sum, s) => sum + s.capacityPercentage, 0) / totalShelves
  );
  const avgTemp = (
    shelvesData.reduce((sum, s) => sum + s.temperature, 0) / totalShelves
  ).toFixed(1);
  const totalWeight = Math.round(
    shelvesData.reduce((sum, s) => sum + (s.itemCount * 2.8), 0) / 10
  );

  const humidity = String(42 + Math.round(Math.sin(timeOffset * 0.5) * 5));

  const envMetrics = {
    totalCapacityUsed: avgCapacity,
    totalCapacityRaw: totalItems > 1000 ? `${(totalItems / 1000).toFixed(1)}K` : String(totalItems),
    totalCapacityMax: "20K",
    temperature: avgTemp,
    humidity,
    weightLoad: String(totalWeight),
  };

  // 3. Recalculate Top SKUs Activity dynamically
  const skusData = initialProducts.map((p) => {
    if (timeOffset === 0) {
      return {
        id: String(p.id),
        name: p.name,
        sku: p.sku,
        movement: p.quantity,
        trend: p.quantity > 400 ? ("up" as const) : p.quantity < 100 ? ("down" as const) : ("neutral" as const),
      };
    }

    const seed = p.id * 53 + timeOffset * 19;
    const qtyNoise = Math.round(Math.sin(seed) * (p.quantity * 0.18));
    const quantity = Math.max(15, p.quantity + qtyNoise);

    return {
      id: String(p.id),
      name: p.name,
      sku: p.sku,
      movement: quantity,
      trend: quantity > p.quantity ? ("up" as const) : quantity < p.quantity ? ("down" as const) : ("neutral" as const),
    };
  });

  // 4. Load shelf metadata
  const firstShelf = shelvesData[0];
  const metadataData = firstShelf
    ? {
        id: firstShelf.id,
        uuid: firstShelf.uuid,
        loadStatus: firstShelf.capacityPercentage > 85 ? "Critical Capacity" : (firstShelf.capacityPercentage > 55 ? "Approaching Limit" : "Optimal Capacity"),
        lastScan: timeOffset === 0 ? "2m ago" : `${2 + timeOffset * 3}m ago`,
        scanAccuracy: timeOffset === 0 ? "99.9%" : "99.8%",
        zone: firstShelf.zone,
      }
    : undefined;

  // 5. Generate Historical CRT Logs matching the timeOffset
  const logsData = initialLogs.map((l, index) => {
    if (timeOffset === 0) {
      return l; // actual database live logs
    }

    // Rewrite system logs dynamically to match history offset times
    const [h, m, s] = l.timestamp.split(":").map(Number);
    let historicalHour = h - timeOffset;
    if (historicalHour < 0) {
      historicalHour += 24; // wrap back in time
    }
    const hhStr = String(historicalHour).padStart(2, "0");
    const mmStr = String(m).padStart(2, "0");
    const ssStr = String(s).padStart(2, "0");
    const timestamp = `${hhStr}:${mmStr}:${ssStr}`;

    // Inject history thematic logs
    let message = l.message;
    if (index === 0) {
      message = `SYSTEM DECK: Historical diagnostic archive reloaded for T - ${timeOffset} Hours.`;
    } else if (index === 1) {
      message = `ENVIRONMENTAL LOG: Room environment stabilized at ${avgTemp}°C.`;
    } else if (index === 2) {
      message = `DATABASE TRANSITION: Successfully fetched historical index [Offset: -${timeOffset}h].`;
    }

    return {
      ...l,
      timestamp,
      message,
    };
  });

  return (
    <div className="flex flex-col">
      {/* 1. Time Machine fütüristik HUD Toolbar */}
      <TimeMachineHUD
        timeOffset={timeOffset}
        setTimeOffset={setTimeOffset}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        liveInterrupt={liveInterrupt}
        onClearInterrupt={handleWarpToLive}
      />

      {/* 2. Bento Grid of Widgets */}
      <div className="mx-auto grid w-full max-w-[1440px] auto-rows-[minmax(180px,_1fr)] grid-cols-4 gap-4">
        {/* Rack Overview (3D Isometric SVG Heatmap & IoT Broadcast simulator) */}
        <BentoCard
          title={`${WIDGETS.RACK_OVERVIEW} ${timeOffset > 0 ? "— HISTORICAL DATA" : ""}`}
          className={`col-span-4 lg:col-span-2 row-span-2 min-h-[400px] transition-all duration-300 ${
            timeOffset > 0 ? "border-amber-500/40 bg-amber-500/[0.01]" : ""
          }`}
        >
          <RackOverview
            shelves={shelvesData}
            activePickSignal={timeOffset === 0 ? activePickSignal : null}
            onClearPickSignal={() => setActivePickSignal(null)}
          />
        </BentoCard>

        {/* Environment Metrics */}
        <BentoCard
          title={`${WIDGETS.ENVIRONMENT_METRICS} ${timeOffset > 0 ? "— HISTORICAL DATA" : ""}`}
          className={`col-span-4 lg:col-span-2 transition-all duration-300 ${
            timeOffset > 0 ? "border-amber-500/40 bg-amber-500/[0.01]" : ""
          }`}
        >
          <EnvironmentMetrics {...envMetrics} />
        </BentoCard>

        {/* Top SKUs Activity */}
        <BentoCard
          title={WIDGETS.TOP_SKUS_ACTIVITY}
          className={`col-span-4 md:col-span-2 lg:col-span-1 transition-all duration-300 ${
            timeOffset > 0 ? "border-amber-500/40 bg-amber-500/[0.01]" : ""
          }`}
        >
          <TopSKUsActivity skus={skusData} />
        </BentoCard>

        {/* Detailed Metadata */}
        <BentoCard
          title={WIDGETS.DETAILED_METADATA}
          className={`col-span-4 md:col-span-2 lg:col-span-1 transition-all duration-300 ${
            timeOffset > 0 ? "border-amber-500/40 bg-amber-500/[0.01]" : ""
          }`}
        >
          <DetailedMetadata {...metadataData} />
        </BentoCard>

        {/* System Logs */}
        <BentoCard
          title={`${WIDGETS.SYSTEM_LOGS} ${timeOffset > 0 ? "— REWOUND INDEX" : ""}`}
          className={`col-span-4 min-h-[160px] bg-card/10 border-border/80 transition-all duration-300 ${
            timeOffset > 0 ? "border-amber-500/40 bg-amber-500/[0.01]" : ""
          }`}
        >
          <SystemLogs logs={logsData} />
        </BentoCard>
      </div>
    </div>
  );
}
