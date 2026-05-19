import Link from "next/link";
import { Terminal } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center border border-primary bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-slate-950">
            <Terminal className="h-4 w-4" />
          </div>
          <span className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">
            Omni<span className="text-primary">Grid</span>
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden items-center gap-8 md:flex font-mono text-[11px] uppercase tracking-widest">
          <Link
            href="#solutions"
            className="text-slate-400 transition-all hover:text-primary"
          >
            [ Solutions ]
          </Link>
          <Link
            href="/dashboard/inventory"
            className="text-slate-400 transition-all hover:text-primary"
          >
            [ Inventory ]
          </Link>
          <Link
            href="/dashboard/analytics"
            className="text-slate-400 transition-all hover:text-primary"
          >
            [ Analytics ]
          </Link>
          <Link
            href="#cta"
            className="text-slate-400 transition-all hover:text-primary"
          >
            [ Contact ]
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest">
          <Link
            href="/sign-in"
            className="text-slate-300 transition-colors hover:text-white"
          >
            Log In
          </Link>
          <Link
            href="/sign-in"
            className="border border-primary bg-primary/10 px-5 py-2 font-bold text-primary transition-all hover:bg-primary hover:text-slate-950"
          >
            Initialize
          </Link>
        </div>
      </div>
    </header>
  );
}
