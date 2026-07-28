export default function Page() {
  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.34em] text-signal">SYSTEM</span>
        <h2 className="uppercase font-display tracking-tight text-lg leading-none">repairs</h2>
        <div className="h-px bg-border flex-1"></div>
      </div>
      <div className="bento-card p-6 text-sm text-muted-foreground font-mono">
        <span className="text-signal animate-pulse">_</span> Fetching live indexer data... (UI Under Construction)
      </div>
    </div>
  );
}