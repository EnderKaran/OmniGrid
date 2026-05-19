"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { getPusherClient } from "@/lib/pusher";
import { simulatePickOrder } from "@/actions/iot";

interface ShelfData {
  id: string; // e.g. "SH-A-01"
  label: string; // e.g. "Shelf A-1-L1"
  capacityPercentage: number;
  temperature: number;
  itemCount: number;
  uuid: string;
  zone: string;
}

// Capacity severity configurations
function getCapacityConfig(pct: number) {
  if (pct >= 80) {
    return {
      fill: "rgba(239, 68, 68, 0.45)", // Red
      stroke: "#ef4444",
      glow: "rgba(239, 68, 68, 0.6)",
      text: "text-red-400",
      status: "Critical Capacity",
    };
  }
  if (pct >= 50) {
    return {
      fill: "rgba(245, 158, 11, 0.45)", // Amber/Gold
      stroke: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.6)",
      text: "text-amber-400",
      status: "Balanced load",
    };
  }
  return {
    fill: "rgba(16, 185, 129, 0.45)", // Emerald
    stroke: "#10b981",
    glow: "rgba(16, 185, 129, 0.6)",
    text: "text-emerald-400",
    status: "Optimal Room",
  };
}

export function RackOverview({
  shelves = [],
  activePickSignal = null,
  onClearPickSignal,
}: {
  shelves?: ShelfData[];
  activePickSignal?: { shelfId: number; shelfName: string } | null;
  onClearPickSignal?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"telemetry" | "iot">("telemetry");
  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(
    shelves[0]?.id || null
  );
  
  // Real-time Pick-to-light states
  const [pulsingShelfId, setPulsingShelfId] = useState<string | null>(null);
  const [iotLogs, setIotLogs] = useState<
    Array<{ id: string; shelfName: string; timestamp: string }>
  >([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);

  const selectedShelf = shelves.find((s) => s.id === selectedShelfId);

  // Listen for parent passed pick signals (such as live Pusher events from DashboardClient)
  useEffect(() => {
    if (!activePickSignal) return;

    const data = activePickSignal;
    const target = shelves.find(
      (s) =>
        s.label.toLowerCase() === data.shelfName.toLowerCase() ||
        s.id.endsWith(String(data.shelfId))
    );

    if (target) {
      setPulsingShelfId(target.id);
      setIotLogs((prev) => [
        {
          id: Math.random().toString(),
          shelfName: target.label,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 4),
      ]);

      // Auto-clear pulsing highlight after 5 seconds
      const timeout = setTimeout(() => {
        setPulsingShelfId((current) =>
          current === target.id ? null : current
        );
      }, 5000);

      // Trigger callback to clear the signal from the parent
      if (onClearPickSignal) {
        onClearPickSignal();
      }

      return () => clearTimeout(timeout);
    }
  }, [activePickSignal, shelves, onClearPickSignal]);

  // Subscribe to Pusher channel for real-time Pick-to-Light guidance simulation
  useEffect(() => {
    try {
      const pusher = getPusherClient();
      if (!pusher) return;
      const channel = pusher.subscribe("warehouse-global");

      channel.bind(
        "iot:pick-triggered",
        (data: { shelfId: number; shelfName: string; timestamp: string }) => {
          // Match by shelf name or construct key e.g. "SH-A-01" from db shelf ID
          // Let's resolve the target shelf in shelves
          const target = shelves.find(
            (s) =>
              s.label.toLowerCase() === data.shelfName.toLowerCase() ||
              s.id.endsWith(String(data.shelfId))
          );

          if (target) {
            setPulsingShelfId(target.id);
            setIotLogs((prev) => [
              {
                id: Math.random().toString(),
                shelfName: target.label,
                timestamp: new Date().toLocaleTimeString(),
              },
              ...prev.slice(0, 4),
            ]);

            // Auto-clear pulsing highlight after 5 seconds
            setTimeout(() => {
              setPulsingShelfId((current) =>
                current === target.id ? null : current
              );
            }, 5000);
          }
        }
      );

      return () => {
        channel.unbind("iot:pick-triggered");
        pusher.unsubscribe("warehouse-global");
      };
    } catch (err) {
      console.error("Failed to bind Pusher channel in RackOverview:", err);
    }
  }, [shelves]);

  // Execute Simulated Pick Action
  const handleTriggerPick = async (targetId: string) => {
    const target = shelves.find((s) => s.id === targetId);
    if (!target) return;

    setIsSimulating(true);
    setSimulationStatus("Broadcasting pick guidance signal...");

    // Find numeric database ID from UUID or construct
    const numericId = parseInt(target.id.split("-").pop() || "1", 10);

    try {
      const res = await simulatePickOrder(numericId, target.label);
      if (res.success) {
        setSimulationStatus("Signal sent! Check 3D Telemetry Matrix.");
        setTimeout(() => setSimulationStatus(null), 3000);
      } else {
        setSimulationStatus("Trigger failed: " + res.error);
      }
    } catch (err: any) {
      setSimulationStatus("Error: " + err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  // Group shelves into mathematical 3D structures: Zones -> Racks -> Levels
  const zonesList = ["Zone A (Cold Storage)", "Zone B (General)", "Zone C (Hazmat)"];
  
  return (
    <div className="flex h-full w-full flex-col gap-4 font-mono text-[11px]">
      {/* Self-contained keyframe styles for high-fidelity golden pulse glowing */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pickGlow {
          0%, 100% {
            fill: rgba(245, 158, 11, 0.95);
            stroke: #fbbf24;
            filter: drop-shadow(0 0 12px rgba(251, 191, 36, 1));
          }
          50% {
            fill: rgba(245, 158, 11, 0.3);
            stroke: #d97706;
            filter: drop-shadow(0 0 2px rgba(217, 119, 6, 0.4));
          }
        }
        .pulse-pick-active {
          animation: pickGlow 1.2s infinite ease-in-out;
        }
      `}} />

      {/* ─── Top Telemetry Console Tabs ─── */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("telemetry")}
            className={cn(
              "px-3 py-1.5 uppercase font-bold tracking-wider border transition-all duration-200",
              activeTab === "telemetry"
                ? "border-primary/45 bg-primary/10 text-primary"
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            [ 📊 3D Telemetry Matrix ]
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("iot")}
            className={cn(
              "relative px-3 py-1.5 uppercase font-bold tracking-wider border transition-all duration-200",
              activeTab === "iot"
                ? "border-primary/45 bg-primary/10 text-primary"
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            [ 📡 IoT Command Deck ]
            {pulsingShelfId && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-slate-500 font-bold">
          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span>Real-time link active</span>
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      {activeTab === "telemetry" ? (
        <div className="flex flex-1 flex-col gap-4">
          {/* Isometric 3D SVG Warehouse Heatmap */}
          <div className="relative flex flex-1 items-center justify-center rounded-lg border border-border/60 bg-black/40 p-2 min-h-[280px]">
            <svg
              viewBox="0 0 660 380"
              className="w-full h-full select-none"
              style={{ maxHeight: "310px" }}
            >
              {/* Grid Background Lines for modern HUD aesthetic */}
              <defs>
                <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 20 M 0 0 L 40 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Legend Indicator */}
              <g transform="translate(15, 20)" className="text-[8px] font-bold text-slate-500 uppercase">
                <circle cx="5" cy="5" r="4" fill="rgba(16, 185, 129, 0.6)" stroke="#10b981" />
                <text x="15" y="8" fill="rgba(255,255,255,0.5)">Optimal (&lt;50%)</text>
                
                <circle cx="95" cy="5" r="4" fill="rgba(245, 158, 11, 0.6)" stroke="#f59e0b" />
                <text x="105" y="8" fill="rgba(255,255,255,0.5)">Balanced (50%-80%)</text>

                <circle cx="185" cy="5" r="4" fill="rgba(239, 68, 68, 0.6)" stroke="#ef4444" />
                <text x="195" y="8" fill="rgba(255,255,255,0.5)">Critical (&gt;80%)</text>
                
                <circle cx="285" cy="5" r="4" fill="#fbbf24" className="animate-pulse" />
                <text x="295" y="8" fill="#fbbf24">Pick guidance Active</text>
              </g>

              {/* RENDER THE 3D ISOMETRIC BLOCKS */}
              {zonesList.map((zoneName, zoneIdx) => {
                // Zone X Centers
                const zoneCenterX = 115 + zoneIdx * 215;

                return (
                  <g key={zoneName}>
                    {/* Zone Boundary Frame */}
                    <path
                      d={`M ${zoneCenterX - 95} 350 L ${zoneCenterX} 302 L ${zoneCenterX + 95} 350 L ${zoneCenterX} 398 Z`}
                      fill="rgba(255,255,255,0.01)"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                    
                    {/* Zone Monospace Title Indicator */}
                    <text
                      x={zoneCenterX}
                      y="368"
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-slate-400 uppercase tracking-widest"
                    >
                      {zoneName.split(" ")[0]} {zoneName.split(" ")[1] || ""}
                    </text>

                    {/* Racks inside Zone (2 racks per zone) */}
                    {[1, 2].map((rackNum) => {
                      const rackIdx = rackNum - 1;
                      // Offset vectors for Rack 1 (left-back) and Rack 2 (right-front)
                      const rx = rackIdx === 0 ? -42 : 42;
                      const ry = rackIdx === 0 ? -20 : 20;
                      
                      // Base central coordinate for the rack tower
                      const bx = zoneCenterX + rx;
                      const by = 260 + ry;

                      // Level Stack (3 levels per rack)
                      return [1, 2, 3].map((lvlNum) => {
                        const lvlIdx = lvlNum - 1;
                        // Box Dimensions
                        const boxW = 46;
                        const boxD = 32;
                        const boxH = 20;

                        // Vertical stack offset
                        const hOffset = lvlIdx * 35;
                        const cx = bx;
                        const cy = by - hOffset;

                        // Identify the shelf item from our DB list
                        // e.g. Shelf Name matches: `Shelf A-1-L1` where A=Zone letter
                        const zoneLetter = zoneIdx === 0 ? "A" : zoneIdx === 1 ? "B" : "C";
                        const targetLabel = `Shelf ${zoneLetter}-${rackNum}-L${lvlNum}`;
                        const shelf = shelves.find((s) => s.label === targetLabel);

                        if (!shelf) return null;

                        const capConfig = getCapacityConfig(shelf.capacityPercentage);
                        const isSelected = selectedShelfId === shelf.id;
                        const isPulsing = pulsingShelfId === shelf.id;

                        // 3D Isometric Polygons relative to center (cx, cy)
                        // Top diamond face
                        const ptTop = `${cx},${cy - boxH} ${cx + boxW / 2},${cy - boxH - boxD / 2} ${cx},${cy - boxH - boxD} ${cx - boxW / 2},${cy - boxH - boxD / 2}`;
                        
                        // Left skewed face
                        const ptLeft = `${cx - boxW / 2},${cy - boxH - boxD / 2} ${cx},${cy - boxH} ${cx},${cy} ${cx - boxW / 2},${cy - boxD / 2}`;
                        
                        // Right skewed face
                        const ptRight = `${cx},${cy - boxH} ${cx + boxW / 2},${cy - boxH - boxD / 2} ${cx + boxW / 2},${cy - boxD / 2} ${cx},${cy}`;

                        // Calculate dynamic volume height inside the box representing inventory level
                        const fillRatio = shelf.capacityPercentage / 100;
                        const fillH = boxH * fillRatio;
                        const fcy = cy; // fill base cy

                        // Filled volume polygons (inside face overlays)
                        const fPtLeft = `${cx - boxW / 2},${fcy - fillH - boxD / 2} ${cx},${fcy - fillH} ${cx},${fcy} ${cx - boxW / 2},${fcy - boxD / 2}`;
                        const fPtRight = `${cx},${fcy - fillH} ${cx + boxW / 2},${fcy - fillH - boxD / 2} ${cx + boxW / 2},${fcy - boxD / 2} ${cx},${fcy}`;
                        const fPtTop = `${cx},${fcy - fillH} ${cx + boxW / 2},${fcy - fillH - boxD / 2} ${cx},${fcy - fillH - boxD} ${cx - boxW / 2},${fcy - fillH - boxD / 2}`;

                        return (
                          <g
                            key={shelf.id}
                            className="cursor-pointer group"
                            onClick={() => setSelectedShelfId(shelf.id)}
                          >
                            {/* 3D Wireframe Container (Invisible/translucent backdrop for mouse targeting) */}
                            <polygon
                              points={`${cx - boxW / 2},${cy - boxH - boxD / 2} ${cx + boxW / 2},${cy - boxH - boxD / 2} ${cx + boxW / 2},${cy} ${cx - boxW / 2},${cy} Z`}
                              fill="transparent"
                              className="pointer-events-auto"
                            />

                            {/* Back wall/outline */}
                            <polygon
                              points={ptTop}
                              fill="rgba(0, 0, 0, 0.55)"
                              stroke={isSelected ? "var(--color-primary)" : "rgba(255, 255, 255, 0.12)"}
                              strokeWidth={isSelected ? "1.5" : "0.8"}
                              className="transition-all duration-300"
                            />

                            {/* Left wall */}
                            <polygon
                              points={ptLeft}
                              fill="rgba(0, 0, 0, 0.45)"
                              stroke={isSelected ? "var(--color-primary)" : "rgba(255, 255, 255, 0.08)"}
                              strokeWidth={isSelected ? "1.5" : "0.8"}
                              className="transition-all duration-300"
                            />

                            {/* Right wall */}
                            <polygon
                              points={ptRight}
                              fill="rgba(0, 0, 0, 0.5)"
                              stroke={isSelected ? "var(--color-primary)" : "rgba(255, 255, 255, 0.08)"}
                              strokeWidth={isSelected ? "1.5" : "0.8"}
                              className="transition-all duration-300"
                            />

                            {/* INVENTORY FILLED VOLUME OVERLAYS */}
                            {fillRatio > 0 && !isPulsing && (
                              <g className="transition-all duration-500 opacity-60 group-hover:opacity-85">
                                <polygon points={fPtLeft} fill={capConfig.fill} />
                                <polygon points={fPtRight} fill={capConfig.fill} />
                                <polygon points={fPtTop} fill={capConfig.fill} stroke={capConfig.stroke} strokeWidth="0.5" />
                              </g>
                            )}

                            {/* PUSHER IOT PICK-TO-LIGHT FLASHING CORE */}
                            {isPulsing && (
                              <g className="pulse-pick-active">
                                <polygon points={ptLeft} />
                                <polygon points={ptRight} />
                                <polygon points={ptTop} />
                              </g>
                            )}

                            {/* Level Label Overlay (Subtle HUD text on hover) */}
                            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                              <rect
                                x={cx - 30}
                                y={cy - boxH - boxD - 18}
                                width="60"
                                height="14"
                                fill="#09090b"
                                stroke={capConfig.stroke}
                                strokeWidth="0.5"
                                rx="1"
                              />
                              <text
                                x={cx}
                                y={cy - boxH - boxD - 8}
                                textAnchor="middle"
                                className="fill-slate-100 text-[8px] font-bold tracking-wider"
                              >
                                {zoneLetter}-{rackNum} L{lvlNum} ({shelf.capacityPercentage}%)
                              </text>
                            </g>
                          </g>
                        );
                      });
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Shelf Details Dashboard Block */}
          {selectedShelf && (
            <div className="flex flex-col md:flex-row items-stretch border border-primary/20 bg-primary/5 p-4 uppercase text-[10px] gap-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-75 rounded-full" />
                  <span className="relative inline-flex h-2 w-2 bg-primary rounded-full" />
                </span>
                <span className="font-bold text-primary text-xs">
                  {selectedShelf.label}
                </span>
                <span className="text-slate-500">
                  [{selectedShelf.id}]
                </span>
              </div>

              <div className="flex-1 grid grid-cols-3 gap-2 border-t md:border-t-0 md:border-l border-border/80 pt-3 md:pt-0 md:pl-4">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[9px] font-bold">Occupancy</span>
                  <span className={cn("font-extrabold text-sm", getCapacityConfig(selectedShelf.capacityPercentage).text)}>
                    {selectedShelf.capacityPercentage}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[9px] font-bold">Qty Stored</span>
                  <span className="text-slate-100 text-sm font-extrabold">
                    {selectedShelf.itemCount} Units
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-[9px] font-bold">Core Temp</span>
                  <span className="text-slate-100 text-sm font-extrabold">
                    {selectedShelf.temperature >= 0 ? "+" : ""}{selectedShelf.temperature.toFixed(1)}°C
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleTriggerPick(selectedShelf.id)}
                disabled={isSimulating}
                className={cn(
                  "px-3 py-2 border border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold tracking-wider hover:bg-amber-500/25 active:scale-95 transition-all text-center self-center",
                  isSimulating && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSimulating ? "Transmitting..." : "[ Simulated IoT Pick ]"}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ─── IoT Command Deck ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {/* Simulation Console Controls */}
          <div className="flex flex-col border border-border/80 bg-black/30 p-4 gap-4">
            <span className="text-[12px] font-bold text-slate-200 border-b border-border/80 pb-2">
              📡 Broadcaster Simulation Deck
            </span>

            <div className="space-y-3">
              <label className="text-[10px] text-slate-500 font-bold block uppercase">
                Target Physical Shelf Coordinates:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {shelves.map((s) => {
                  const isPulsing = pulsingShelfId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedShelfId(s.id)}
                      className={cn(
                        "p-2 border font-mono text-[9px] text-center transition-all uppercase font-bold",
                        selectedShelfId === s.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card/10 text-slate-400 hover:border-slate-500",
                        isPulsing && "border-amber-500 bg-amber-500/10 text-amber-400 animate-pulse"
                      )}
                    >
                      {s.label.replace("Shelf ", "")}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedShelf && (
              <div className="mt-auto space-y-3">
                <button
                  type="button"
                  onClick={() => handleTriggerPick(selectedShelf.id)}
                  disabled={isSimulating}
                  className="w-full py-3 border border-amber-500 bg-amber-500/10 hover:bg-amber-500/25 active:scale-98 transition-all font-bold text-center text-amber-400 text-xs tracking-widest"
                >
                  {isSimulating
                    ? "🤖 EMITTING RF LIGHT GUIDANCE SIGNAL..."
                    : `🔥 DISPATCH PICK LIGHT GUIDANCE TO [ ${selectedShelf.label.toUpperCase()} ]`}
                </button>
                {simulationStatus && (
                  <div className="text-[10px] font-bold text-amber-400 animate-pulse text-center">
                    {simulationStatus}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* IoT Telemetry Receiver Logs */}
          <div className="flex flex-col border border-border/80 bg-black/30 p-4 gap-4">
            <span className="text-[12px] font-bold text-slate-200 border-b border-border/80 pb-2 flex justify-between items-center">
              <span>📟 Live Receiver Signal Monitor</span>
              <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                RX ON
              </span>
            </span>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[220px] font-mono pr-2">
              {iotLogs.length === 0 ? (
                <div className="flex flex-1 items-center justify-center text-slate-600 text-[10px] italic py-8">
                  Waiting for active IoT signals...
                </div>
              ) : (
                iotLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-2 border.5 border-amber-500/20 bg-amber-500/5 text-[9px] animate-fade-in"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                      <span className="text-amber-400 font-bold">GUIDANCE_ON</span>
                      <span className="text-slate-300 font-bold">{log.shelfName}</span>
                    </div>
                    <span className="text-slate-500 font-medium">{log.timestamp}</span>
                  </div>
                ))
              )}
            </div>
            
            <div className="text-[9px] text-slate-500 uppercase border-t border-border/60 pt-2 font-bold leading-normal">
              📡 Receiver captures and parses all virtual Pick-to-light RF pulses broadcasted through Pusher channels instantly.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
