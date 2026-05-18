import { UserButton } from "@clerk/nextjs";

import { DASHBOARD_LABELS } from "@/lib/constants";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-8 py-5">
      {/* Logo & Branding */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 border border-emerald-500/20">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="text-emerald-400"
          >
            <rect
              x="1"
              y="1"
              width="7"
              height="7"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="10"
              y="1"
              width="7"
              height="7"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <rect
              x="1"
              y="10"
              width="7"
              height="7"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <rect
              x="10"
              y="10"
              width="7"
              height="7"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.3"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-[15px] font-semibold tracking-tight text-slate-100">
            {DASHBOARD_LABELS.APP_NAME}
          </h1>
          <p className="text-[11px] font-medium tracking-wide text-slate-500">
            {DASHBOARD_LABELS.APP_TAGLINE}
          </p>
        </div>
      </div>

      {/* Status & User */}
      <div className="flex items-center gap-5">
        {/* Live indicator */}
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-medium tracking-wide text-emerald-400/90">
            LIVE
          </span>
        </div>

        <div className="h-6 w-px bg-white/[0.06]" />

        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8 ring-2 ring-white/[0.06] ring-offset-2 ring-offset-transparent",
            },
          }}
        />
      </div>
    </header>
  );
}
