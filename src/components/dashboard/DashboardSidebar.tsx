"use client";

import { Terminal, LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, Scan } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

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
  const { user } = useUser();

  return (
    <aside className="flex h-screen w-full flex-col border-r border-border bg-sidebar px-4 py-6 sticky top-0 font-mono select-none">
      {/* Brand logo container */}
      <div className="mb-10 px-2 border-b border-border pb-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center border border-primary bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-slate-950">
            <Terminal className="h-4 w-4" />
          </div>
          <span className="text-md font-bold uppercase tracking-[0.15em] text-white">
            Omni<span className="text-primary">Grid</span>
          </span>
        </Link>
        <div className="mt-2 text-[9px] text-slate-500 uppercase tracking-widest flex items-center justify-between">
          <span>OPERATOR CORE</span>
          <span className="text-accent">ONLINE</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex flex-1 flex-col gap-1.5 text-[11px] uppercase tracking-widest">
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
                "flex items-center gap-3 px-3 py-2.5 transition-all relative border border-transparent",
                isActive
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "text-slate-400 hover:text-white hover:bg-card/40 hover:border-border/60"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.name}</span>
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile with sharp modular design */}
      <div className="mt-auto border-t border-border pt-6">
        <Link href="/dashboard/profile" className="flex items-center gap-3 border border-border p-3 bg-card/20 hover:border-primary/45 transition-colors cursor-pointer group">
          {user?.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt={user.fullName || "Operator"} 
              className="h-8 w-8 border border-border object-cover group-hover:border-primary transition-colors"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center border border-primary bg-primary/20 text-primary font-bold text-xs">
              {user?.firstName?.charAt(0) || "O"}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-semibold text-slate-200 uppercase tracking-widest truncate group-hover:text-primary transition-colors">
              {user?.fullName || "SYSTEM_USER"}
            </span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
              SECURE_ID // 409
            </span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
