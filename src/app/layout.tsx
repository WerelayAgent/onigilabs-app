import type { Metadata } from "next";
import { Archivo_Black, Hind, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Radar, Search, Activity, GitCompare, Wrench, Menu, Wallet } from "lucide-react";

const archivo = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo" });
const hind = Hind({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-hind" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "OnigiLabs — Solana Meme Coin Scanner",
  description: "Every token on Solana, scored. Deployer history, holder clusters, liquidity locks in one report.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${hind.variable} ${jetbrains.variable} dark`}>
      <body className="antialiased font-sans bg-background text-foreground min-h-screen flex flex-col">
        {/* Header */}
        <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-md px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Menu className="w-5 h-5 text-muted-foreground md:hidden" />
            <a href="/" className="flex items-center gap-2 group">
              <Image src="/onigilabs-logo.png" alt="OnigiLabs Logo" width={36} height={36} className="group-hover:-translate-y-0.5 transition-transform" />
              <span className="font-display text-xl tracking-tight hidden sm:block">
                onigi<span className="text-signal">labs</span>
              </span>
            </a>
          </div>
          
          <div className="flex-1 max-w-md mx-6 relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              placeholder="Search token or wallet — paste 0x… or type a ticker" 
              className="w-full bg-card/50 border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono focus:outline-none focus:border-signal/60"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 border border-border bg-card px-3 py-1.5 rounded-lg text-[11px] font-mono text-gray-400">
              <span className="w-1.5 h-1.5 bg-safe rounded-full blip"></span>
              SOLANA · 101
            </div>
            <button className="flex items-center gap-2 border border-border bg-card hover:border-signal/50 text-[11px] font-mono px-3 py-1.5 rounded-lg transition-colors">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
              CONNECT WALLET
            </button>
          </div>
        </header>

        {/* Layout */}
        <div className="flex flex-1 pt-16">
          {/* Sidebar */}
          <aside className="w-60 border-r border-border fixed bottom-0 left-0 top-16 hidden md:flex flex-col bg-background">
            <div className="p-4 overflow-y-auto flex-1 space-y-6">
              <div>
                <div className="text-[10px] font-mono tracking-widest text-signal/80 mb-2 px-2 flex items-center gap-2">
                  <span>RESEARCH</span>
                </div>
                <nav className="space-y-1">
                  <a href="/" className="flex items-center gap-3 bg-signal/10 text-signal px-3 py-2.5 rounded-xl text-sm font-semibold relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-signal rounded-r-full"></div>
                    <Radar className="w-4 h-4" />
                    <div>
                      <div>Scanner</div>
                      <div className="text-[10px] text-signal/60 font-normal">Live token feed</div>
                    </div>
                  </a>
                  <a href="#" className="flex items-center gap-3 hover:bg-card text-gray-400 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors">
                    <Activity className="w-4 h-4" />
                    <div>
                      <div>Watchlist</div>
                      <div className="text-[10px] text-gray-500">Your saved contracts</div>
                    </div>
                  </a>
                  <a href="#" className="flex items-center gap-3 hover:bg-card text-gray-400 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors">
                    <GitCompare className="w-4 h-4" />
                    <div>
                      <div>Compare</div>
                      <div className="text-[10px] text-gray-500">Official vs lookalike</div>
                    </div>
                  </a>
                </nav>
              </div>
            </div>
            <div className="p-3 border-t border-border">
              <div className="border border-border bg-card px-3 py-2 rounded-lg text-[10px] font-mono text-gray-400 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-safe rounded-full blip"></span>
                 SOLANA MAINNET
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 md:ml-60">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
