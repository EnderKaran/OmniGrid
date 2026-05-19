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
  BASE: "rounded-none border border-border bg-card/30 shadow-lg shadow-black/30 transition-all duration-300 ease-out relative",
  HOVER: "hover:border-primary/40 hover:bg-card/60 hover:shadow-2xl hover:shadow-black/60",
  HEADER:
    "text-[12px] font-semibold uppercase tracking-[0.25em] text-primary/95 font-mono flex items-center gap-2 border-b border-border/40 pb-2 mb-2",
  GLOW_ACCENT:
    "before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-primary/30 before:to-transparent before:pointer-events-none",
} as const;
