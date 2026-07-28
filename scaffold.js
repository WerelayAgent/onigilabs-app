const fs = require('fs');
const path = require('path');

const routes = ["watchlist", "compare", "deployers", "smart-money", "live", "x-radar", "wallet", "method", "diagnostics", "repairs", "mcp"];

routes.forEach(route => {
    const dir = path.join(__dirname, 'src', 'app', route);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    const content = `export default function Page() {
  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.34em] text-signal">SYSTEM</span>
        <h2 className="uppercase font-display tracking-tight text-lg leading-none">${route.replace('-', ' ')}</h2>
        <div className="h-px bg-border flex-1"></div>
      </div>
      <div className="bento-card p-6 text-sm text-muted-foreground font-mono">
        <span className="text-signal animate-pulse">_</span> Fetching live indexer data... (UI Under Construction)
      </div>
    </div>
  );
}`;
    fs.writeFileSync(path.join(dir, 'page.tsx'), content);
});

console.log("Scaffolded " + routes.length + " routes.");
