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
  processing: { label: "PROCESSING", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20", icon: Clock },
  shipped: { label: "SHIPPED", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Truck },
  delivered: { label: "DELIVERED", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  pending: { label: "PENDING", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: AlertTriangle },
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
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-teal-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-md">
              <ShoppingCart className="w-5 h-5 text-teal-400" />
            </div>
            <h1 className="text-lg font-bold tracking-widest text-white flex items-center gap-2">
              ORDER<span className="text-teal-400">.MANAGEMENT</span>
            </h1>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="SEARCH ORDER ID, CUSTOMER..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 text-slate-200 text-sm rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all font-mono placeholder:font-sans"
              />
            </div>
          </div>

          <div className="text-[10px] font-mono tracking-widest text-slate-500 flex items-center gap-2">
            LAST SYNC: LIVE
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-pulse" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center px-6 py-3 border-t border-white/5 bg-slate-900/20 gap-2">
          {(["all", "processing", "shipped", "delivered", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-wide transition-colors",
                activeFilter === f
                  ? f === "all" ? "bg-teal-500/20 text-teal-400" : STATUS_CONFIG[f as OrderStatus].color
                  : "hover:bg-white/5 text-slate-400"
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
          <div className="grid grid-cols-[1fr_1.5fr_0.5fr_0.8fr_1fr_0.8fr_0.3fr] gap-4 px-5 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-white/5">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Destination</span>
            <span>Status</span>
            <span />
          </div>

          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 font-mono text-xs">
              NO MATCHING SHIPMENTS FOUND
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusConf = STATUS_CONFIG[order.status];
              const StatusIcon = statusConf.icon;
              return (
                <div
                  key={order.id}
                  className="grid grid-cols-[1fr_1.5fr_0.5fr_0.8fr_1fr_0.8fr_0.3fr] gap-4 items-center bg-slate-900/40 border border-white/5 hover:border-white/10 backdrop-blur-md rounded-xl px-5 py-4 shadow-lg transition-all duration-300 ease-out cursor-pointer group"
                >
                  <span className="text-sm font-mono font-bold text-white">{order.id}</span>
                  <div>
                    <div className="text-sm text-slate-200">{order.customer}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">{order.date}</div>
                  </div>
                  <span className="text-sm font-mono text-slate-300">{order.items}</span>
                  <span className="text-sm font-mono font-bold text-white">{order.total}</span>
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-sm text-slate-400">{order.destination}</span>
                  </div>
                  <div className={cn("flex items-center gap-1.5 text-[10px] font-bold tracking-wider border rounded-full px-2.5 py-1 w-fit", statusConf.color)}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConf.label}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-colors" />
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full border-t border-white/5 bg-slate-950/90 backdrop-blur-sm px-6 py-2 flex justify-between items-center z-40">
        <div className="text-[10px] font-mono text-slate-500 tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-500/50" />
          {filteredOrders.length} ORDERS DISPLAYED
        </div>
        <div className="text-[10px] font-mono text-slate-600 tracking-widest">
          ORDER_MGMT_V2.4.0
        </div>
      </footer>
    </div>
  );
}
