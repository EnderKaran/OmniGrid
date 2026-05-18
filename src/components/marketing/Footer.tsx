import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-transparent">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row md:gap-0">
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} OmniGrid Inc. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-slate-500">
          <Link href="#" className="transition-colors hover:text-slate-300">
            Privacy Policy
          </Link>
          <Link href="#" className="transition-colors hover:text-slate-300">
            Terms of Service
          </Link>
          <Link href="#" className="transition-colors hover:text-slate-300">
            Contact Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
