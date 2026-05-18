// ──────────────────────────────────────────────
// Dashboard UI Constants
// ──────────────────────────────────────────────

export const DASHBOARD_LABELS = {
  APP_NAME: "OmniGrid",
  APP_TAGLINE: "Warehouse Intelligence",
  WIDGETS: {
    RACK_OVERVIEW: "Rack Overview",
    DETAILED_METADATA: "Detailed Metadata",
    ENVIRONMENT_METRICS: "Environment Metrics",
    TOP_SKUS_ACTIVITY: "Top SKUs Activity",
    SYSTEM_LOGS: "System Logs",
  },
  EMPTY_STATE: {
    LOADING: "Loading…",
    NO_DATA: "No data available",
    COMING_SOON: "Coming soon",
  },
} as const;

// ──────────────────────────────────────────────
// Widget Card Styles (Quiet Luxury tokens)
// ──────────────────────────────────────────────

export const CARD_STYLES = {
  BASE: "rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md shadow-lg shadow-black/20 transition-all duration-300",
  HOVER: "hover:border-white/[0.1] hover:bg-white/[0.05] hover:shadow-xl hover:shadow-black/25",
  HEADER:
    "text-[13px] font-medium uppercase tracking-[0.15em] text-slate-400/80",
  GLOW_ACCENT:
    "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.04] before:to-transparent before:pointer-events-none",
} as const;
