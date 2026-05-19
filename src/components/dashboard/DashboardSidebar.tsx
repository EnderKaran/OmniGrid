"use client";

import { Hexagon, LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, Scan } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { name: "Inventory", icon: Package, href: "/dashboard/inventory" },
  { name: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  { name: "Scanner", icon: Scan, href: "/scanner" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-full flex-col border-r border-white/5 bg-slate-950/80 px-4 py-6 backdrop-blur-md sticky top-0">
      {/* Logo */}
      <div className="mb-10 px-2">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Hexagon className="h-6 w-6 text-cyan-400" fill="currentColor" fillOpacity={0.2} />
          <span className="text-xl font-bold tracking-tight text-white">
            OmniGrid <span className="text-slate-300">WMS</span>
          </span>
        </Link>
        <div className="mt-1 text-[10px] font-mono tracking-widest text-slate-500">
          v2.4.0-PRO
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto border-t border-white/5 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-semibold">
            AC
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">Alex Chen</span>
            <span className="text-xs text-slate-500">Logistics Mgr.</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
