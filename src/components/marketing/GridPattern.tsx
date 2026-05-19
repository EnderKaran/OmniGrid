export function GridPattern() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-background tech-grid">
      <div className="absolute inset-0 bg-background/40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)] opacity-35"></div>
      {/* HUD corner ticks */}
      <div className="absolute left-6 top-24 w-4 h-4 border-l border-t border-primary/20 pointer-events-none" />
      <div className="absolute right-6 top-24 w-4 h-4 border-r border-t border-primary/20 pointer-events-none" />
      <div className="absolute left-6 bottom-6 w-4 h-4 border-l border-b border-primary/20 pointer-events-none" />
      <div className="absolute right-6 bottom-6 w-4 h-4 border-r border-b border-primary/20 pointer-events-none" />
    </div>
  );
}
