import type { Metadata } from "next";
import { Archivo_Black, Hind, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { 
  Radar, Star, GitCompare, Code2, LineChart, Radio, 
  MessageCircle, Wallet, HelpCircle, Activity, Wrench, 
  Bot, Menu, Search
} from "lucide-react";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import ConnectWalletButton from "@/components/ConnectWalletButton";

const archivo = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo" });
const hind = Hind({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-hind" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "OnigiLabs — Robinhood Chain Meme Coin Scanner",
  description: "Every token on Robinhood Chain, scored. Deployer history, holder clusters, liquidity locks in one report.",
};

const MENU_ITEMS = [
  { group: "RESEARCH", items: [
    { name: "Scanner", desc: "Live token feed", icon: Radar, href: "/", active: true },
    { name: "Watchlist", desc: "Your saved contracts", icon: Star, href: "/watchlist" },
    { name: "Compare", desc: "Official vs lookalike", icon: GitCompare, href: "/compare" }
  ]},
  { group: "INTELLIGENCE", items: [
    { name: "Deployers", desc: "Track serial creators", icon: Code2, href: "/deployers" },
    { name: "Smart money", desc: "Follow profitable wallets", icon: LineChart, href: "/smart-money" },
    { name: "Live tape", desc: "Real-time large swaps", icon: Radio, href: "/live" },
    { name: "X radar", desc: "CT sentiment and mentions", icon: MessageCircle, href: "/x-radar" }
  ]},
  { group: "TOOLS", items: [
    { name: "Wallet score", desc: "Analyze any address", icon: Wallet, href: "/wallet" },
    { name: "How we score", desc: "Read the methodology", icon: HelpCircle, href: "/method" }
  ]},
  { group: "SYSTEM", items: [
    { name: "Diagnostics", desc: "Indexer health", icon: Activity, href: "/diagnostics" },
    { name: "Repairs", desc: "Report incorrect data", icon: Wrench, href: "/repairs" },
    { name: "AI / MCP", desc: "Use OnigiLabs in Cursor", icon: Bot, href: "/mcp" }
  ]}
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${hind.variable} ${jetbrains.variable} dark`}>
      <body className="antialiased font-sans bg-background text-foreground min-h-screen flex flex-col">
        <WalletContextProvider>
          {/* Header */}
          <header className="fixed inset-x-0 top-0 z-50 h-16 md:h-20 border-b border-border bg-background px-4 md:px-5 flex items-center justify-between">
            <div className="flex items-center gap-3 w-60 shrink-0">
              <button className="md:hidden p-1.5 text-muted-foreground"><Menu className="w-5 h-5" /></button>
              <a href="/" className="flex items-center gap-2 group">
                <Image src="/onigilabs-logo.png" alt="OnigiLabs Logo" width={32} height={32} className="group-hover:-translate-y-0.5 transition-transform shrink-0" />
                <span className="font-display text-[19px] tracking-tight hidden sm:block leading-none mt-1">
                  onigi<span className="text-signal">labs</span>
                </span>
              </a>
            </div>
            
            <div className="flex-1 max-w-lg mx-6 relative hidden md:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                placeholder="Search token or wallet — paste 0x… or type a ticker" 
                className="w-full bg-card/60 border border-border rounded-lg pl-8 pr-12 py-1.5 text-sm font-mono focus:outline-none focus:border-signal/60 placeholder:text-muted-foreground/70"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground">Ctrl K</kbd>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden lg:flex items-center gap-2 border border-border bg-card px-3 py-2 rounded-lg text-sm font-mono tracking-wider text-muted-foreground">
                <span className="w-1.5 h-1.5 bg-safe rounded-full blip"></span>
                SOLANA MAINNET · 101
              </div>
              <div className="wallet-button-container">
                <ConnectWalletButton />
              </div>
            </div>
          </header>

        {/* Layout */}
        <div className="flex flex-1 pt-16 md:pt-20">
          {/* Sidebar */}
          <aside className="w-60 border-r border-border fixed bottom-0 left-0 top-16 md:top-20 z-30 hidden md:flex flex-col bg-background">
            <div className="px-3 pt-4">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  placeholder="Jump to…" 
                  className="w-full bg-card/60 border border-border rounded-lg pl-8 pr-2 py-1.5 text-sm font-mono focus:outline-none focus:border-signal/60 placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
            <nav className="flex-1 space-y-6 overflow-y-auto px-2 py-4 custom-scrollbar">
              {MENU_ITEMS.map((group, idx) => (
                <div key={idx}>
                  <div className="px-2.5 pb-2 font-mono text-xs tracking-[0.22em] text-signal/80 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-signal/50 rounded-full"></span>
                    {group.group}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item, i) => (
                      <a key={i} href={item.href} className={`group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-all ${item.active ? 'bg-signal/10 text-signal' : 'text-muted-foreground hover:bg-card hover:text-foreground'}`}>
                        {item.active && <span className="absolute left-0 top-1/2 w-1 -translate-y-1/2 rounded-full bg-signal h-5"></span>}
                        <item.icon className={`w-4 h-4 shrink-0 ${item.active ? '' : 'opacity-70 group-hover:opacity-100'}`} strokeWidth={item.active ? 2.25 : 1.75} />
                        <div className="min-w-0 flex-1">
                          <span className={`block truncate text-base leading-tight ${item.active ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
                          <span className={`block truncate text-xs leading-tight ${item.active ? 'text-signal/60' : 'text-muted-foreground/60'}`}>{item.desc}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 md:ml-60 flex flex-col min-h-full">
            <div className="flex-1">
              {children}
            </div>
            {/* Footer */}
            <footer className="mt-16 border-t border-border bg-card">
              <div className="flex flex-col gap-3 px-4 py-8 font-mono text-sm text-muted-foreground md:flex-row md:items-center md:justify-between max-w-7xl mx-auto w-full">
                <p className="flex items-center gap-2">
                  <Image src="/onigilabs-logo.png" alt="OnigiLabs logo" width={24} height={24} className="opacity-50 grayscale" />
                  <span>onigilabs · on-chain forensics for Robinhood Chain. Data is informational, not financial advice.</span>
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <a className="font-semibold text-signal" href="/">Scanner</a>
                  <a href="#" className="hover:text-foreground">Watchlist</a>
                  <a href="#" className="hover:text-foreground">Compare</a>
                  <a href="#" className="hover:text-foreground">Deployers</a>
                  <a href="https://x.com/onigilabs_" target="_blank" rel="noreferrer" className="hover:text-foreground">X</a>
                  <a href="https://t.me/onigilabs" target="_blank" rel="noreferrer" className="hover:text-foreground">Telegram</a>
                </div>
              </div>
            </footer>
          </main>

          {/* Floating Action Button */}
          <button className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-signal/50 bg-signal/15 px-4 py-3 font-mono text-sm tracking-[0.16em] text-signal shadow-[0_10px_30px_-12px_var(--color-signal)] backdrop-blur-xl transition-transform hover:-translate-y-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-signal blip"></span>
            ASK ONIGILABS
          </button>
        </div>
        </WalletContextProvider>
      </body>
    </html>
  );
}
