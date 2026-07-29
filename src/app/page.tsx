"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Star, ShieldCheck, Activity, Search } from "lucide-react";
import Image from "next/image";

type TokenData = {
  address: string;
  name: string;
  symbol: string;
  icon_url: string;
  score: number;
  s_diff: string;
  r_score: number;
  sniped: string;
  price_usd: number;
  price_change_24h: number;
  market_cap: number;
  off_api: string;
  liquidity_usd: number;
  volume_24h: number;
  top_10: string;
  holders: string;
  dex_url: string;
  verification_tier: string;
};

// Extracted badges to match screenshot exact colors and styles
const OfficialBadge = () => <span className="ml-2 inline-flex items-center gap-1 rounded bg-yellow-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-yellow-500 uppercase tracking-widest"><ShieldCheck className="w-2.5 h-2.5"/> OFFICIAL DEPLOYER</span>;
const VerifiedBadge = () => <span className="ml-2 inline-flex items-center gap-1 rounded bg-[#3fa9f5]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#3fa9f5] uppercase tracking-widest"><ShieldCheck className="w-2.5 h-2.5"/> VERIFIED</span>;

const FilterPill = ({ active, children }: { active?: boolean, children: React.ReactNode }) => (
  <button className={`px-4 py-1.5 border border-border rounded font-mono text-[9px] uppercase tracking-widest transition-colors whitespace-nowrap ${active ? 'bg-signal text-background border-signal font-bold' : 'hover:bg-white/5 text-muted-foreground'}`}>
    {children}
  </button>
);

export default function ScannerV5() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from our local API which now securely gets the absolute newest token profiles
    axios.get("/api/tokens")
      .then(res => {
        setTokens(res.data.tokens || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch failed", err);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (val: number) => {
    if (val < 0.0001) return "$" + val.toPrecision(2);
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: val < 1 ? 4 : 2 }).format(val);
  };

  const formatCompact = (val: number) =>
    new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(val);

  return (
    <div className="p-8 space-y-6">
      
      {/* 1. Hero & Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-signal">
            <span className="w-1.5 h-1.5 rounded-full bg-signal"></span>
            <span>ON-CHAIN FORENSICS - PUMP.FUN</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tighter leading-[0.9]">
            FIND OUT<br/>WHO REALLY OWNS<br/>THE COIN.
          </h1>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed border-l-2 border-signal/30 pl-4">
            Who deployed it, how much they still hold, whether liquidity can be pulled, and which wallets are secretly the same person.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bento-card p-6 h-[200px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">SYSTEM STATUS</span>
              <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-signal border border-signal/30 bg-signal/10 px-2 py-1 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse"></div>
                STABLE
              </span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Network</span>
                <span>Pons Family (Robinhood Chain)</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Chain ID</span>
                <span>101</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coverage</span>
                <span>2,191 Tokens</span>
              </div>
            </div>
          </div>
          <div className="bento-card p-4 flex flex-col justify-center h-20">
             <div className="flex items-center gap-2 text-signal font-mono text-[11px] uppercase font-bold tracking-widest">
               <Activity className="w-4 h-4"/> INDEXER LIVE
             </div>
             <div className="font-mono text-[9px] text-muted-foreground mt-1">Full scan pending</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
         <div className="bento-card p-4 border-l-4 border-l-signal">
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">TOKENS INDEXED</div>
            <div className="font-display text-2xl">2,191</div>
         </div>
         <div className="bento-card p-4 border-l-4 border-l-signal/50">
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">DEPLOYERS TRACKED</div>
            <div className="font-display text-2xl">630</div>
         </div>
         <div className="bento-card p-4 border-l-4 border-l-border">
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">LIVE TAPE</div>
            <div className="font-mono text-lg text-muted-foreground">pending</div>
         </div>
      </div>

      {/* 2. Advanced Filters Component */}
      <div className="space-y-3 pt-8">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.34em] text-signal font-bold">01</span>
          <h2 className="uppercase font-display tracking-tight text-sm leading-none">FILTERS</h2>
          <div className="h-px bg-border flex-1"></div>
          <span className="font-mono text-[9px] text-muted-foreground">Quick filter presets or setup specific search.</span>
        </div>

        <div className="bento-card p-4 space-y-4">
           <div className="flex flex-wrap gap-2">
             <FilterPill active>TOP 50</FilterPill>
             <FilterPill>RECENT</FilterPill>
             <FilterPill>VOLUME 24H</FilterPill>
             <FilterPill>LIQUIDITY</FilterPill>
             <FilterPill>UNLOCKED</FilterPill>
             <FilterPill>VERIFIED</FilterPill>
             <FilterPill>SOCIAL SURGE</FilterPill>
             <FilterPill>FORCED</FilterPill>
             <FilterPill>OFF API</FilterPill>
             <FilterPill>CORE/T FIRST</FilterPill>
             <FilterPill>TOKENIZED EQUITY</FilterPill>
             <FilterPill>+ FAVORITES</FilterPill>
           </div>
           
           <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/50">
             <div className="flex items-center gap-6 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
               <span>TIERS:</span>
               <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground"><input type="checkbox" checked readOnly className="accent-yellow-500" /> <span className="text-yellow-500">GOLD</span></label>
               <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground"><input type="checkbox" checked readOnly className="accent-[#3fa9f5]" /> <span className="text-[#3fa9f5]">BLUE</span></label>
               <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground"><input type="checkbox" checked readOnly className="accent-white" /> <span className="text-foreground">SILVER</span></label>
               <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground"><input type="checkbox" checked readOnly className="accent-[#cd7f45]" /> <span className="text-[#cd7f45]">BRONZE</span></label>
               <label className="flex items-center gap-1.5 cursor-pointer hover:text-foreground"><input type="checkbox" readOnly className="accent-border" /> UNVERIFIED</label>
             </div>
             
             <div className="relative w-full max-w-xs">
                <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  placeholder="MINT, TKN, SYMB..." 
                  className="w-full bg-[var(--hover-surface)] border border-border rounded pl-8 pr-3 py-1.5 text-[9px] font-mono focus:outline-none focus:border-signal/60 uppercase"
                />
             </div>
           </div>
        </div>
      </div>

      {/* 3. High-Density Token Table */}
      <div className="space-y-3 pt-6">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.34em] text-signal font-bold">02</span>
          <h2 className="uppercase font-display tracking-tight text-sm leading-none">TOKENS</h2>
          <div className="h-px bg-border flex-1"></div>
          <span className="font-mono text-[9px] text-muted-foreground">Showing filtered: 100/2,191 Token records</span>
        </div>

        <div className="bento-card overflow-hidden">
          <div className="bg-[var(--hover-surface)] border-b border-border px-4 py-3 flex justify-between items-center">
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Token list - 100</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Live real-time feed active... <span className="text-red-500">Deceptive liquidity hidden and strange findings.</span></div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-signal">Export To JSON</div>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[1400px] text-left">
              <thead>
                <tr className="border-b border-border font-mono text-[9px] tracking-widest text-muted-foreground bg-background">
                  <th className="px-3 py-2 font-normal text-left w-6">#</th>
                  <th className="px-3 py-2 font-normal text-left w-6">★</th>
                  <th className="px-3 py-2 font-normal text-left min-w-[200px]">TOKEN</th>
                  <th className="px-3 py-2 font-normal text-center">SCORE</th>
                  <th className="px-3 py-2 font-normal text-right">S.DIFF</th>
                  <th className="px-3 py-2 font-normal text-right">R.SCORE</th>
                  <th className="px-3 py-2 font-normal text-right">SNIPED</th>
                  <th className="px-3 py-2 font-normal text-right">PRICE</th>
                  <th className="px-3 py-2 font-normal text-right">24H</th>
                  <th className="px-3 py-2 font-normal text-right">MCAP</th>
                  <th className="px-3 py-2 font-normal text-center">OFF API</th>
                  <th className="px-3 py-2 font-normal text-right">LIQ</th>
                  <th className="px-3 py-2 font-normal text-right">VOL 24H</th>
                  <th className="px-3 py-2 font-normal text-right">TOP 10 %</th>
                  <th className="px-3 py-2 font-normal text-right pr-6">HOLDERS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr>
                    <td colSpan={15} className="px-4 py-8 text-center text-muted-foreground font-mono text-[10px]">Loading deep indexer data...</td>
                  </tr>
                ) : tokens.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="px-4 py-16 text-center text-muted-foreground font-mono text-[10px]">No tokens found. The indexer might be blocked or returning empty data.</td>
                  </tr>
                ) : tokens.map((token, index) => (
                  <tr key={token.address} className="hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => window.open(token.dex_url, "_blank")}>
                    <td className="px-3 py-2 text-[9px] font-mono text-muted-foreground">{index + 1}</td>
                    <td className="px-3 py-2">
                      <Star className="w-3 h-3 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {token.icon_url ? (
                          <Image src={token.icon_url} alt={token.symbol} width={16} height={16} className="rounded-full bg-border" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-border" />
                        )}
                        <div className="font-bold text-[10px] leading-tight text-foreground flex items-center">
                           {token.symbol}
                           {token.verification_tier === 'gold' && <OfficialBadge />}
                           {token.verification_tier === 'blue' && <VerifiedBadge />}
                           <span className="text-[9px] text-muted-foreground font-normal ml-2 truncate max-w-[100px]">{token.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                       <span className={`font-mono text-[10px] px-1.5 py-0.5 border rounded ${token.score > 80 ? 'border-yellow-500 text-yellow-500' : token.score > 60 ? 'border-signal text-signal' : 'border-border text-muted-foreground'}`}>
                          {token.score}
                       </span>
                    </td>
                    <td className={`px-3 py-2 text-right font-mono text-[10px] ${parseFloat(token.s_diff) > 0 ? 'text-signal' : 'text-red-500'}`}>{parseFloat(token.s_diff) > 0 ? '+' : ''}{token.s_diff}</td>
                    <td className="px-3 py-2 text-right font-mono text-[10px] text-muted-foreground">{token.r_score}</td>
                    <td className="px-3 py-2 text-right font-mono text-[10px] text-muted-foreground">{token.sniped}</td>
                    <td className="px-3 py-2 text-right font-mono text-[10px]">{formatCurrency(token.price_usd)}</td>
                    <td className={`px-3 py-2 text-right font-mono text-[10px] ${token.price_change_24h > 0 ? 'text-signal' : 'text-red-500'}`}>
                      {token.price_change_24h > 0 ? '+' : ''}{token.price_change_24h.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-[10px] text-foreground">${formatCompact(token.market_cap)}</td>
                    <td className="px-3 py-2 text-center font-mono text-[9px] text-muted-foreground">{token.off_api}</td>
                    <td className="px-3 py-2 text-right font-mono text-[10px] text-foreground">${formatCompact(token.liquidity_usd)}</td>
                    <td className="px-3 py-2 text-right font-mono text-[10px] text-foreground">${formatCompact(token.volume_24h)}</td>
                    <td className="px-3 py-2 text-right font-mono text-[10px] text-foreground">{token.top_10}</td>
                    <td className="px-3 py-2 text-right font-mono text-[10px] text-foreground pr-6">{token.holders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
