import Link from "next/link";
import { Hexagon } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.05] bg-slate-950/50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Hexagon className="h-6 w-6 text-cyan-400" fill="currentColor" fillOpacity={0.2} />
          <span className="text-lg font-bold tracking-tight text-white">
            Omni<span className="text-slate-300">Grid</span>
          </span>
        </div>

        {/* Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#solutions"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-cyan-400"
          >
            Solutions
          </Link>
          <Link
            href="/dashboard/inventory"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-cyan-400"
          >
            Inventory
          </Link>
          <Link
            href="/dashboard/analytics"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-cyan-400"
          >
            Analytics
          </Link>
          <Link
            href="#cta"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-cyan-400"
          >
            Contact
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-6">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Log In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
