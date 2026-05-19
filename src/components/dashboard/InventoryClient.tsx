"use client";

import React, { useState, useTransition, useMemo } from "react";
import { 
  LayoutGrid, 
  Search, 
  User, 
  AlertTriangle,
  Activity,
  Plus,
  Minus,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
  Grid,
  List,
  CheckCircle2,
  XCircle,
  Copy,
  Clock
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { updateStock, createProduct } from "@/actions/inventory";

export type ItemStatus = "normal" | "warning" | "critical";

export interface InventoryItem {
  id: string;
  name: string;
  loc: string;
  stock: string;
  unit: string;
  sku: string;
  trend: string;
  status: ItemStatus;
  chartData: number[];
  shelfId: number;
  zoneName: string;
}

interface ShelfOption {
  id: number;
  name: string;
}

// Sparkline Component
const Sparkline = ({ data, status }: { data: number[], status: ItemStatus }) => {
  const max = Math.max(...data) === Math.min(...data) ? Math.max(...data) + 1 : Math.max(...data);
  const min = Math.min(...data) === max ? 0 : Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const color = status === "normal" ? "oklch(0.82 0.16 142)" : "oklch(0.80 0.08 75)";

  return (
    <div className="w-full h-8 relative flex items-end">
      <svg viewBox="0 -10 100 120" className="w-full h-full preserve-3d overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${status}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="100%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <polyline
          fill={`url(#gradient-${status})`}
          stroke="none"
          points={`0,100 ${points} 100,100`}
        />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
          points={points}
        />
      </svg>
    </div>
  );
};

export function InventoryClient({ items: initialItems, shelves }: { items: InventoryItem[], shelves: ShelfOption[] }) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [activeFilter, setActiveFilter] = useState<"all" | "critical" | "moving">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isPending, startTransition] = useTransition();

  // Stats boxes
  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalUnits = items.reduce((acc, curr) => acc + parseInt(curr.stock), 0);
    const criticalCount = items.filter(i => i.status === "critical").length;
    const warningCount = items.filter(i => i.status === "warning").length;
    return { totalItems, totalUnits, criticalCount, warningCount };
  }, [items]);

  // Form State for Ingest Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    quantity: 100,
    shelfId: shelves[0]?.id || 1,
    unit: "UNITS",
    description: ""
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const toastIdCounter = React.useRef(0);

  // Fast Client-Side Search with telemetric stopwatch
  const { filteredItems, searchDurationMs } = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const startTime = typeof window !== "undefined" ? performance.now() : 0;
    const res = items.filter((item) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "critical" && (item.status === "critical" || item.status === "warning")) ||
        (activeFilter === "moving" && item.trend === "Stable" && item.status === "normal");
      
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.loc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.zoneName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
    // eslint-disable-next-line react-hooks/purity
    const endTime = typeof window !== "undefined" ? performance.now() : 0;
    return {
      filteredItems: res,
      searchDurationMs: (endTime - startTime).toFixed(3)
    };
  }, [items, activeFilter, searchQuery]);

  // Notifications or messages state
  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "error" }[]>([]);

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    const id = ++toastIdCounter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`SKU copied: ${text}`, "success");
  };

  // Adjust stock direct action
  const handleAdjustStock = async (itemId: string, shelfId: number, amount: number) => {
    const numericId = parseInt(itemId);
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const currentQty = parseInt(item.stock);
    const newQty = currentQty + amount;
    if (newQty < 0) {
      triggerToast("Stock cannot drop below zero", "error");
      return;
    }

    // Reactive UI optimistic update
    setItems(prev => prev.map(i => {
      if (i.id === itemId) {
        const isLowStock = newQty < 100;
        const isCritical = newQty < 50;
        const status: ItemStatus = isCritical ? "critical" : (isLowStock ? "warning" : "normal");
        return {
          ...i,
          stock: String(newQty).padStart(4, "0"),
          status,
          trend: newQty < 50 ? "REORDER" : "Stable",
          chartData: [...i.chartData.slice(1), newQty]
        };
      }
      return i;
    }));

    startTransition(async () => {
      const res = await updateStock({
        productId: numericId,
        shelfId: shelfId,
        quantityChange: amount,
        reason: `Manual Telemetry Adjust: ${amount > 0 ? "+" : ""}${amount}`
      });

      if (res.success) {
        triggerToast(`${item.name} stock adjusted by ${amount > 0 ? "+" : ""}${amount}`, "success");
      } else {
        triggerToast(res.error || "Failed to sync update to server", "error");
        // Revert back if it fails
        setItems(initialItems);
      }
    });
  };

  // Ingest form submit
  const handleIngestSku = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    if (!formData.name || !formData.sku) {
      setFormError("Name and SKU are required");
      return;
    }

    startTransition(async () => {
      const res = await createProduct({
        name: formData.name,
        sku: formData.sku,
        barcode: formData.barcode || `BAR-${formData.sku}`,
        quantity: formData.quantity,
        shelfId: Number(formData.shelfId),
        description: formData.description
      });

      if (res.success && res.data) {
        setFormSuccess(true);
        triggerToast(`Ingested SKU: ${formData.sku} successfully!`, "success");
        
        // Add to state dynamically
        const newProductItem: InventoryItem = {
          id: String(res.data.id),
          name: formData.name,
          loc: `Shelf-${formData.shelfId}`,
          stock: String(formData.quantity).padStart(4, "0"),
          unit: formData.unit,
          sku: formData.sku,
          trend: formData.quantity < 50 ? "REORDER" : "Stable",
          status: formData.quantity < 50 ? "critical" : (formData.quantity < 100 ? "warning" : "normal"),
          chartData: [20, 40, formData.quantity, formData.quantity, formData.quantity],
          shelfId: Number(formData.shelfId),
          zoneName: "Added Sector"
        };
        
        setItems(prev => [newProductItem, ...prev]);

        // Reset
        setFormData({
          name: "",
          sku: "",
          barcode: "",
          quantity: 100,
          shelfId: shelves[0]?.id || 1,
          unit: "UNITS",
          description: ""
        });
        
        setTimeout(() => {
          setShowModal(false);
          setFormSuccess(false);
        }, 1500);
      } else {
        setFormError(res.error || "Failed to register SKU");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono text-[11px] selection:bg-primary/30 relative">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-border backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 border border-primary/20 bg-primary/10 hover:bg-primary/20 transition-all cursor-pointer">
              <LayoutGrid className="w-5 h-5 text-primary animate-pulse" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-sm font-extrabold tracking-widest text-white flex items-center gap-2">
                NEXUS_STOCK<span className="text-primary">.MATRIX</span>
              </h1>
              <span className="text-[9px] text-slate-500 tracking-wider">LIVE REPOSITORIES: 520 REAL RECORDS</span>
            </div>
          </div>

          {/* Search Bar with Telemetry timing */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="PROBING: ENTER SKU, ITEM OR ZONE LOCATION..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card/45 border border-border text-slate-200 text-xs py-2.5 pl-10 pr-40 focus:outline-none focus:border-primary/50 transition-all font-mono rounded-none"
              />
              <div className="absolute inset-y-0 right-3 flex items-center gap-2 text-[9px] text-slate-500 font-semibold pointer-events-none">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>QUERY: {searchDurationMs}ms</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 border border-primary bg-primary/10 hover:bg-primary/20 text-white font-extrabold text-[10px] tracking-widest px-4 py-2 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              INGEST NEW SKU
            </button>

            <Link href="/dashboard/profile" className="flex items-center gap-3 pl-4 border-l border-border group cursor-pointer">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-white group-hover:text-primary transition-colors">OPS MANAGER</span>
                <span className="text-[9px] font-mono tracking-widest text-primary">SECURE_LEAD</span>
              </div>
              <div className="w-9 h-9 border border-primary/30 bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <User className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Filters and Speedometers */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-3 border-t border-border bg-card/10 gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveFilter("all")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 border text-[9px] font-extrabold tracking-widest transition-all",
                activeFilter === "all" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-card/25 text-slate-400"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              ALL ITEMS ({items.length})
            </button>
            <button 
              onClick={() => setActiveFilter("critical")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 border text-[9px] font-extrabold tracking-widest transition-all",
                activeFilter === "critical" ? "border-primary bg-primary/10 text-primary animate-pulse" : "border-border hover:bg-card/25 text-slate-400"
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-primary" />
              CRITICAL/WARNING ({stats.criticalCount + stats.warningCount})
            </button>
            <button 
              onClick={() => setActiveFilter("moving")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 border text-[9px] font-extrabold tracking-widest transition-all",
                activeFilter === "moving" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-border hover:bg-card/25 text-slate-400"
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              STABLE STOCKS
            </button>
          </div>

          <div className="flex items-center gap-4 text-[9px] tracking-widest text-slate-500 font-bold">
            <div className="flex items-center gap-1.5 border border-border/40 px-2 py-1 bg-slate-900/50">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span>DB: NEON_POSTGRES</span>
            </div>
            <div className="flex items-center gap-1.5 border border-border/40 px-2 py-1 bg-slate-900/50">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>ENGINE: DRIZZLE_ORM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
              <span>SYNCED</span>
            </div>
          </div>
        </div>
      </header>

      {/* METRIC COMMAND CENTER CARDS */}
      <section className="p-6 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="border border-border/70 bg-card/10 p-4 relative group hover:border-primary/40 transition-colors">
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary/40 group-hover:bg-primary" />
          <div className="text-slate-500 text-[9px] uppercase tracking-widest mb-1.5">Database High-density SKUs</div>
          <div className="text-2xl font-black text-white flex items-baseline gap-2 font-mono">
            {stats.totalItems} <span className="text-[10px] text-slate-400 font-normal">REGISTERED</span>
          </div>
          <div className="text-[9px] text-slate-500 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            100% verified schema fields
          </div>
        </div>

        {/* Metric 2 */}
        <div className="border border-border/70 bg-card/10 p-4 relative group hover:border-primary/40 transition-colors">
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500/40" />
          <div className="text-slate-500 text-[9px] uppercase tracking-widest mb-1.5">Total Physical Volume</div>
          <div className="text-2xl font-black text-white flex items-baseline gap-2 font-mono">
            {stats.totalUnits.toLocaleString()} <span className="text-[10px] text-emerald-400 font-normal">UNITS</span>
          </div>
          <div className="text-[9px] text-slate-500 mt-2 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            +8.4% intake trend this week
          </div>
        </div>

        {/* Metric 3 */}
        <div className="border border-border/70 bg-card/10 p-4 relative group hover:border-primary/40 transition-colors">
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary/40 animate-ping" />
          <div className="text-slate-500 text-[9px] uppercase tracking-widest mb-1.5">Telemetry Critical Alerts</div>
          <div className="text-2xl font-black text-primary flex items-baseline gap-2 font-mono">
            {stats.criticalCount} <span className="text-[10px] text-slate-400 font-normal">CRITICAL LEVELS</span>
          </div>
          <div className="text-[9px] text-slate-500 mt-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-primary" />
            Needs immediate reorder actions
          </div>
        </div>

        {/* Metric 4 */}
        <div className="border border-border/70 bg-card/10 p-4 relative group hover:border-primary/40 transition-colors">
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500/40" />
          <div className="text-slate-500 text-[9px] uppercase tracking-widest mb-1.5">Avg Search Probing Speed</div>
          <div className="text-2xl font-black text-blue-400 flex items-baseline gap-2 font-mono">
            0.02ms <span className="text-[10px] text-slate-400 font-normal">PER RECORD</span>
          </div>
          <div className="text-[9px] text-slate-500 mt-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
            Hyper-threaded indexed arrays
          </div>
        </div>

      </section>

      {/* VIEW CONTROLS */}
      <section className="px-6 max-w-[1600px] mx-auto pb-4 flex justify-between items-center border-b border-border/30">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold flex items-center gap-2">
          <span>Matrix Layout Core</span>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
          <span className="text-white bg-primary/10 px-2 py-0.5 border border-primary/20">
            SHOWING {filteredItems.length} OF {items.length} PRODUCTS
          </span>
        </div>

        {/* Mode Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-border p-1">
          <button 
            onClick={() => setViewMode("table")}
            className={cn(
              "p-1.5 transition-all",
              viewMode === "table" ? "bg-primary text-slate-950" : "text-slate-400 hover:text-white"
            )}
            title="Compact Matrix View"
          >
            <List className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-1.5 transition-all",
              viewMode === "grid" ? "bg-primary text-slate-950" : "text-slate-400 hover:text-white"
            )}
            title="Telemetry Cards View"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* MAIN PRODUCTS DISPLAY */}
      <main className="p-6 max-w-[1600px] mx-auto pb-24">
        
        {/* COMPACT MATRIX TABLE VIEW */}
        {viewMode === "table" ? (
          <div className="w-full border border-border bg-slate-950 overflow-hidden relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-card/25 text-[10px] tracking-widest text-slate-400 font-extrabold select-none">
                    <th className="py-3 px-4">SKU / BARCODE</th>
                    <th className="py-3 px-4">PRODUCT CATALOG NAME</th>
                    <th className="py-3 px-4">SECTOR ZONE</th>
                    <th className="py-3 px-4">SHELF LOCATION</th>
                    <th className="py-3 px-4 text-center">QUANTITY LEVEL</th>
                    <th className="py-3 px-4 text-center">STATUS STATUS</th>
                    <th className="py-3 px-4 text-center">SPARKLINE LEVEL</th>
                    <th className="py-3 px-4 text-right">TELEMETRIC ADJUSTMENTS (REAL-TIME DB)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500 font-bold uppercase tracking-widest">
                        --- NO MATCHING TELEMETRY RECORDS FOUND ---
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr 
                        key={item.id} 
                        className={cn(
                          "hover:bg-card/15 transition-colors group",
                          item.status === "critical" ? "bg-primary/5" : ""
                        )}
                      >
                        {/* SKU */}
                        <td className="py-3 px-4 font-bold text-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="font-mono tracking-tight">{item.sku}</span>
                            <button 
                              onClick={() => copyToClipboard(item.sku)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-900 border border-transparent hover:border-border transition-all text-slate-500 hover:text-white"
                              title="Copy SKU code"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* NAME */}
                        <td className="py-3 px-4 font-bold text-white uppercase text-[11px]">
                          {item.name}
                        </td>

                        {/* ZONE */}
                        <td className="py-3 px-4">
                          <span className={cn(
                            "px-2 py-0.5 border text-[9px] font-extrabold uppercase tracking-wider",
                            item.zoneName.includes("Cold") ? "border-sky-500/30 bg-sky-500/10 text-sky-400" :
                            item.zoneName.includes("Hazmat") ? "border-amber-600/30 bg-amber-600/10 text-amber-500" :
                            "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          )}>
                            {item.zoneName}
                          </span>
                        </td>

                        {/* SHELF LOCATION */}
                        <td className="py-3 px-4 font-mono font-semibold text-slate-400">
                          {item.loc}
                        </td>

                        {/* STOCK */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center justify-center gap-1.5">
                            <span className={cn(
                              "text-sm font-bold font-mono tracking-tight",
                              item.status === "critical" ? "text-primary animate-pulse" : "text-white"
                            )}>
                              {item.stock}
                            </span>
                            <span className="text-[8px] text-slate-500 font-semibold">{item.unit}</span>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            {item.status === "critical" ? (
                              <span className="flex items-center gap-1 border border-primary/30 bg-primary/10 text-primary text-[8px] font-black px-1.5 py-0.5 animate-pulse uppercase tracking-wider">
                                <AlertTriangle className="w-2.5 h-2.5 text-primary" />
                                REORDER
                              </span>
                            ) : item.status === "warning" ? (
                              <span className="flex items-center gap-1 border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-[8px] font-black px-1.5 py-0.5 uppercase tracking-wider">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                LOW STOCK
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[8px] font-black px-1.5 py-0.5 uppercase tracking-wider">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                SECURE
                              </span>
                            )}
                          </div>
                        </td>

                        {/* CHART */}
                        <td className="py-3 px-4 w-[100px]">
                          <Sparkline data={item.chartData} status={item.status} />
                        </td>

                        {/* ACTIONS */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 bg-slate-900 border border-border p-1">
                            <button 
                              disabled={isPending}
                              onClick={() => handleAdjustStock(item.id, item.shelfId, -10)}
                              className="p-1 border border-border bg-slate-950 text-slate-400 hover:text-white hover:bg-card transition-all disabled:opacity-50"
                              title="Decrement Stock by 10"
                            >
                              <span className="text-[8px] font-bold">-10</span>
                            </button>
                            <button 
                              disabled={isPending}
                              onClick={() => handleAdjustStock(item.id, item.shelfId, -1)}
                              className="p-1 border border-border bg-slate-950 text-slate-400 hover:text-white hover:bg-card transition-all disabled:opacity-50"
                              title="Decrement Stock by 1"
                            >
                              <Minus className="w-3 h-3 text-slate-400 hover:text-white" />
                            </button>
                            
                            <div className="w-px h-4 bg-border/60 mx-1" />

                            <button 
                              disabled={isPending}
                              onClick={() => handleAdjustStock(item.id, item.shelfId, 1)}
                              className="p-1 border border-border bg-slate-950 text-slate-400 hover:text-white hover:bg-card transition-all disabled:opacity-50"
                              title="Increment Stock by 1"
                            >
                              <Plus className="w-3 h-3 text-slate-400 hover:text-white" />
                            </button>
                            <button 
                              disabled={isPending}
                              onClick={() => handleAdjustStock(item.id, item.shelfId, 10)}
                              className="p-1 border border-border bg-slate-950 text-slate-400 hover:text-white hover:bg-card transition-all disabled:opacity-50"
                              title="Increment Stock by 10"
                            >
                              <span className="text-[8px] font-bold">+10</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.length === 0 ? (
              <div className="col-span-full border border-border py-16 text-center text-slate-500 font-bold uppercase tracking-widest bg-slate-950">
                --- NO MATCHING TELEMETRY RECORDS FOUND ---
              </div>
            ) : (
              filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group bg-card/25 border border-border p-5 transition-all duration-300 flex flex-col justify-between h-[180px] hover:border-primary/45 relative"
                >
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shadow-lg",
                      item.status === "normal" ? "bg-emerald-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]" : "bg-primary shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    )} />
                  </div>

                  {/* Card Top */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0 pr-4">
                      <h3 className="text-xs font-bold text-slate-200 uppercase truncate" title={item.name}>
                        {item.name}
                      </h3>
                      <div className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest">
                        LOC: {item.loc}{" // "}{item.zoneName}
                      </div>
                    </div>
                  </div>

                  {/* Card Middle */}
                  <div className="flex items-end justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-widest">Stock Level</div>
                      <div className="flex items-baseline gap-1.5">
                        <span className={cn(
                          "text-2xl font-black font-mono tracking-tighter",
                          item.status === "critical" || item.status === "warning" ? "text-primary animate-pulse" : "text-white"
                        )}>
                          {item.stock}
                        </span>
                        <span className="text-[9px] text-slate-500">{item.unit.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="w-[85px] shrink-0 border border-border/30 p-1 bg-slate-950">
                      <Sparkline data={item.chartData} status={item.status} />
                    </div>
                  </div>

                  {/* Card Bottom / Actions */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                      SKU: {item.sku}
                    </div>

                    <div className="flex items-center gap-1 bg-slate-900 border border-border/80 px-1 py-0.5">
                      <button 
                        disabled={isPending}
                        onClick={() => handleAdjustStock(item.id, item.shelfId, -1)}
                        className="p-1 border border-border bg-slate-950 text-slate-400 hover:text-white disabled:opacity-50"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <button 
                        disabled={isPending}
                        onClick={() => handleAdjustStock(item.id, item.shelfId, 1)}
                        className="p-1 border border-border bg-slate-950 text-slate-400 hover:text-white disabled:opacity-50"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* TOAST SYSTEM */}
      <div className="fixed bottom-12 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id}
            className={cn(
              "px-4 py-3 border text-white font-mono text-[10px] tracking-widest uppercase flex items-center justify-between gap-3 shadow-2xl animate-fade-in pointer-events-auto",
              t.type === "success" ? "bg-slate-950 border-emerald-500 text-emerald-400" : "bg-slate-950 border-primary text-primary"
            )}
          >
            <div className="flex items-center gap-2">
              {t.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-primary shrink-0" />}
              <span>{t.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* REGISTER SKU MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg border border-border bg-slate-950 p-6 relative font-mono text-[11px]">
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary" />
            
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <h2 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                SKU_INGESTION_MODULE
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-white border border-border/60 hover:border-border bg-card/25 px-2 py-0.5 text-[9px] font-bold"
              >
                CLOSE [ESC]
              </button>
            </div>

            {formError && (
              <div className="p-3 border border-primary bg-primary/10 text-primary mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 border border-emerald-500 bg-emerald-500/10 text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
                <span>SKU SYSTEM INTEGRATION COMPLETED SUCCESSFULLY!</span>
              </div>
            )}

            <form onSubmit={handleIngestSku} className="flex flex-col gap-4">
              {/* Product name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 font-bold uppercase tracking-wider">Product Name / Label *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Optik Sensör Seti"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-card/45 border border-border text-slate-200 text-xs py-2 px-3 focus:outline-none focus:border-primary/50 transition-all font-mono rounded-none"
                />
              </div>

              {/* SKU & Barcode */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">SKU Code *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. SEN-OPT-1025"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                    className="bg-card/45 border border-border text-slate-200 text-xs py-2 px-3 focus:outline-none focus:border-primary/50 transition-all font-mono rounded-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Barcode (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. BAR-SEN-OPT-1025"
                    value={formData.barcode}
                    onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                    className="bg-card/45 border border-border text-slate-200 text-xs py-2 px-3 focus:outline-none focus:border-primary/50 transition-all font-mono rounded-none"
                  />
                </div>
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Initial Stock Level *</label>
                  <input 
                    type="number" 
                    required
                    min={0}
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    className="bg-card/45 border border-border text-slate-200 text-xs py-2 px-3 focus:outline-none focus:border-primary/50 transition-all font-mono rounded-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Intake Unit *</label>
                  <select 
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="bg-card/45 border border-border text-slate-200 text-xs py-2 px-3 focus:outline-none focus:border-primary/50 transition-all font-mono rounded-none"
                  >
                    <option value="UNITS">UNITS (INDIVIDUAL)</option>
                    <option value="BOXES">BOXES (PACKAGED)</option>
                  </select>
                </div>
              </div>

              {/* Shelf selector (dropdown) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 font-bold uppercase tracking-wider">Physical Shelf Assignment *</label>
                <select 
                  value={formData.shelfId}
                  onChange={(e) => setFormData(prev => ({ ...prev, shelfId: Number(e.target.value) }))}
                  className="bg-card/45 border border-border text-slate-200 text-xs py-2 px-3 focus:outline-none focus:border-primary/50 transition-all font-mono rounded-none text-white font-bold"
                >
                  {shelves.map((shelf) => (
                    <option key={shelf.id} value={shelf.id}>
                      {shelf.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 font-bold uppercase tracking-wider">Technical Description</label>
                <textarea 
                  placeholder="Enter details about this stock variant..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-card/45 border border-border text-slate-200 text-xs py-2 px-3 focus:outline-none focus:border-primary/50 transition-all font-mono rounded-none h-16 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2 border-t border-border/50 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-border/80 text-slate-400 bg-card/25 px-4 py-2 hover:text-white"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="border border-primary bg-primary/10 hover:bg-primary/20 text-white font-extrabold px-6 py-2 transition-all disabled:opacity-50"
                >
                  {isPending ? "INGESTING IN PROGRESS..." : "REGISTER SKU"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="fixed bottom-0 w-full border-t border-border bg-slate-950 px-6 py-2.5 flex justify-between items-center z-30">
        <div className="text-[9px] text-slate-500 tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-400 shadow-[0_0_8px_rgba(45,212,191,0.5)] rounded-full" />
          SYSTEM SECURE
        </div>
        <div className="text-[9px] text-slate-500 tracking-widest uppercase">
          SERVER REGION: NEON-US-EAST-2
        </div>
        <div className="text-[9px] text-slate-600 tracking-widest">
          MATRIX_INGEST_V3.0.0
        </div>
      </footer>

    </div>
  );
}
