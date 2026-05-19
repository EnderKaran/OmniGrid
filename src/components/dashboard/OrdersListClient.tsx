"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderStatus = "processing" | "shipped" | "delivered" | "pending";

export interface Order {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: OrderStatus;
  date: string;
  destination: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  processing: { label: "PROCESSING", color: "text-primary border-primary/30 bg-primary/5", icon: Clock },
  shipped: { label: "SHIPPED", color: "text-slate-200 border-border bg-card/25", icon: Truck },
  delivered: { label: "DELIVERED", color: "text-accent border-accent/30 bg-accent/5", icon: CheckCircle2 },
  pending: { label: "PENDING", color: "text-primary border-primary/20 bg-primary/10", icon: AlertTriangle },
};

export function OrdersListClient({ initialOrders }: { initialOrders: Order[] }) {
  const [activeFilter, setActiveFilter] = useState<"all" | OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = initialOrders.filter((o) => {
    const matchesFilter = activeFilter === "all" || o.status === activeFilter;
    const matchesSearch =
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-slate-300 font-mono text-[11px] selection:bg-primary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-primary/20 bg-primary/10">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-sm font-extrabold tracking-widest text-white flex items-center gap-2">
              ORDER<span className="text-primary">.MANAGEMENT</span>
            </h1>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="SEARCH ORDER ID, CUSTOMER..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card/45 border border-border text-slate-200 text-xs py-2 pl-10 pr-4 focus:outline-none focus:border-primary/50 transition-all font-mono rounded-none"
              />
            </div>
          </div>

          <div className="text-[9px] tracking-widest text-slate-500 flex items-center gap-2 font-bold">
            LAST SYNC: LIVE
            <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center px-6 py-3 border-t border-border bg-card/10 gap-2">
          {(["all", "processing", "shipped", "delivered", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 border text-[9px] font-extrabold tracking-widest transition-all",
                activeFilter === f
                  ? f === "all" ? "border-primary bg-primary/10 text-primary" : STATUS_CONFIG[f as OrderStatus].color
                  : "border-border hover:bg-card/25 text-slate-400"
              )}
            >
              {f === "all" ? (
                <>
                  <Filter className="w-3.5 h-3.5" />
                  ALL ORDERS
                </>
              ) : (
                STATUS_CONFIG[f].label
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Order List */}
      <main className="p-6 max-w-[1400px] mx-auto pb-20">
        <div className="flex flex-col gap-3">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1.5fr_0.5fr_0.8fr_1fr_0.8fr_0.3fr] gap-4 px-5 py-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest border-b border-border font-bold">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Destination</span>
            <span>Status</span>
            <span />
          </div>

          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 uppercase tracking-widest font-bold">
              NO MATCHING SHIPMENTS FOUND
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusConf = STATUS_CONFIG[order.status];
              const StatusIcon = statusConf.icon;
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-[1fr_1.5fr_0.5fr_0.8fr_1fr_0.8fr_0.3fr] gap-4 items-center bg-card/25 border border-border hover:border-primary/30 px-5 py-4 transition-all duration-300 cursor-pointer group"
                >
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{order.id}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-200 uppercase">{order.customer}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-widest">{order.date}</div>
                  </div>
                  <span className="text-xs font-bold text-slate-300">{order.items}U</span>
                  <span className="text-xs font-extrabold text-white">{order.total}</span>
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs text-slate-400 uppercase">{order.destination}</span>
                  </div>
                  <div className={cn("flex items-center gap-1.5 text-[9px] font-extrabold tracking-widest border px-2.5 py-1 w-fit uppercase", statusConf.color)}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConf.label}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full border-t border-border bg-background/95 px-6 py-2.5 flex justify-between items-center z-40">
        <div className="text-[9px] text-slate-500 tracking-widest flex items-center gap-2 font-bold">
          <div className="w-1.5 h-1.5 bg-primary" />
          {filteredOrders.length} ORDERS DISPLAYED
        </div>
        <div className="text-[9px] text-slate-600 tracking-widest">
          ORDER_MGMT_V2.4.0
        </div>
      </footer>
    </div>
  );
}
