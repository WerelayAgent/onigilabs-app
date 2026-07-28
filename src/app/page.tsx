"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Radar, Activity, Star } from "lucide-react";
import Image from "next/image";

type TokenData = {
  address: string;
  name: string;
  symbol: string;
  icon_url: string;
  price_usd: number;
  market_cap: number;
  liquidity_usd: number;
  volume_24h: number;
  price_change_24h: number;
  holders_count: number;
  launched_at: string;
  dex_url: string;
  verification_tier: string;
};

const OfficialBadge = () => (
  <span className="inline-flex items-center gap-1.5" title="Official — A canonical asset">
    <span className="inline-flex shrink-0 items-center gap-1.5 align-middle">
      <svg width="13" height="13" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 4px #f5b64266)' }}>
        <path d="M12 1.6l2.7 2.05 3.38-.25.86 3.28 2.86 1.82-1.4 3.1 1.4 3.1-2.86 1.82-.86 3.28-3.38-.25L12 22.4l-2.7-2.05-3.38.25-.86-3.28L2.2 15.5l1.4-3.1-1.4-3.1L5.06 7.5l.86-3.28 3.38.25z" fill="#f5b642"></path>
        <path d="M7.6 12.3l2.9 2.9 5.9-6" fill="none" stroke="#0b0d10" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </span>
  </span>
);

const VerifiedBadge = () => (
  <span className="inline-flex items-center gap-1.5" title="Verified project">
    <span className="inline-flex shrink-0 items-center gap-1.5 align-middle">
      <svg width="13" height="13" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 4px #3fa9f566)' }}>
        <path d="M12 1.6l2.7 2.05 3.38-.25.86 3.28 2.86 1.82-1.4 3.1 1.4 3.1-2.86 1.82-.86 3.28-3.38-.25L12 22.4l-2.7-2.05-3.38.25-.86-3.28L2.2 15.5l1.4-3.1-1.4-3.1L5.06 7.5l.86-3.28 3.38.25z" fill="#3fa9f5"></path>
        <path d="M7.6 12.3l2.9 2.9 5.9-6" fill="none" stroke="#0b0d10" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </span>
  </span>
);

const EstablishedBadge = () => (
  <span className="inline-flex items-center gap-1.5" title="Established">
    <span className="inline-flex shrink-0 items-center gap-1.5 align-middle">
      <svg width="13" height="13" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 4px #c3cad666)' }}>
        <path d="M12 1.6l2.7 2.05 3.38-.25.86 3.28 2.86 1.82-1.4 3.1 1.4 3.1-2.86 1.82-.86 3.28-3.38-.25L12 22.4l-2.7-2.05-3.38.25-.86-3.28L2.2 15.5l1.4-3.1-1.4-3.1L5.06 7.5l.86-3.28 3.38.25z" fill="#c3cad6"></path>
        <path d="M7.6 12.3l2.9 2.9 5.9-6" fill="none" stroke="#0b0d10" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </span>
  </span>
);

const EmergingBadge = () => (
  <span className="inline-flex items-center gap-1.5" title="Emerging">
    <span className="inline-flex shrink-0 items-center gap-1.5 align-middle">
      <svg width="13" height="13" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 4px #cd7f4566)' }}>
        <path d="M12 1.6l2.7 2.05 3.38-.25.86 3.28 2.86 1.82-1.4 3.1 1.4 3.1-2.86 1.82-.86 3.28-3.38-.25L12 22.4l-2.7-2.05-3.38.25-.86-3.28L2.2 15.5l1.4-3.1-1.4-3.1L5.06 7.5l.86-3.28 3.38.25z" fill="#cd7f45"></path>
        <path d="M7.6 12.3l2.9 2.9 5.9-6" fill="none" stroke="#0b0d10" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </span>
  </span>
);

export default function Home() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/tokens")
      .then(res => {
        setTokens(res.data.tokens || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (val: number) => {
    if (val < 0.0001) return "$" + val.toPrecision(2);
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: val < 1 ? 4 : 2 }).format(val);
  };

  const formatCompact = (val: number) =>
    new Intl.NumberFormat("en-US", { notation: "compact" }).format(val);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-12">
      {/* Hero Stats */}
      <div className="grid grid-cols-12 gap-5 max-w-6xl">
        <div className="bento-card lift p-6 sm:p-8 col-span-12 lg:col-span-8 flex flex-col justify-center">
          <div className="text-xs font-mono tracking-[0.22em] text-signal uppercase flex items-center gap-2 mb-6">
            <Radar className="w-4 h-4" />
            <span>On-chain forensics · Solana</span>
          </div>
          <h1 className="text-4xl sm:text-[44px] font-display leading-[1.05] tracking-tight">
            Find out<br />who really owns<br />the coin.
          </h1>
          <div className="w-12 h-px bg-signal mt-6 mb-5"></div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Every token on Solana, scored. Deployer history, holder clusters, liquidity locks and wallet links in one report.
          </p>
        </div>
        
        <div className="bento-card lift p-6 sm:p-8 col-span-12 lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground">System Status</span>
              <span className="flex items-center gap-2 bg-safe/10 text-safe border border-safe/20 px-2 py-0.5 rounded-full text-xs font-mono">
                <span className="w-1.5 h-1.5 bg-safe rounded-full blip"></span>
                STABLE
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm border-b border-border pb-3">
                <span className="text-muted-foreground">Network</span>
                <span className="font-mono text-xs">SOLANA</span>
              </div>
              <div className="flex justify-between text-sm border-b border-border pb-3">
                <span className="text-muted-foreground">Coverage</span>
                <span className="font-mono text-xs">PUMP.FUN & DEX</span>
              </div>
            </div>
          </div>
          <div className="bg-signal/10 border border-signal/20 rounded-lg p-3 mt-6 flex items-center gap-3">
            <Activity className="w-4 h-4 text-signal" />
            <span className="text-xs uppercase font-display tracking-wide text-signal">Indexer Live</span>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="space-y-4 w-full">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tracking-[0.34em] text-signal">01</span>
          <h2 className="uppercase font-display tracking-tight text-[15px] sm:text-[17px] leading-none">Live Scanner</h2>
          <div className="h-px bg-border flex-1"></div>
        </div>

        <div className="bento-card overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[1180px] text-left">
              <thead>
                <tr className="border-b border-border font-mono text-xs tracking-[0.14em] text-muted-foreground bg-[var(--hover-surface)]">
                  <th className="px-3 py-2.5 font-normal text-left w-8">★</th>
                  <th className="px-3 py-2.5 font-normal text-left">TOKEN</th>
                  <th className="px-3 py-2.5 font-normal text-right">SCORE</th>
                  <th className="px-3 py-2.5 font-normal text-right">PRICE</th>
                  <th className="px-3 py-2.5 font-normal text-right">24H</th>
                  <th className="px-3 py-2.5 font-normal text-right">MCAP</th>
                  <th className="px-3 py-2.5 font-normal text-right">LIQ</th>
                  <th className="px-3 py-2.5 font-normal text-right">VOL 24H</th>
                  <th className="px-3 py-2.5 font-normal text-right">TIER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground font-mono text-xs">Loading indexer data...</td>
                  </tr>
                ) : tokens.map((token, index) => (
                  <tr key={token.address} className="hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => window.open(token.dex_url, "_blank")}>
                    <td className="px-3 py-2.5">
                      <Star className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {token.icon_url ? (
                            <Image src={token.icon_url} alt={token.symbol} width={24} height={24} className="rounded-full bg-border" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-border" />
                          )}
                          <div className="absolute -bottom-1 -right-1">
                            {token.verification_tier === 'blue' && <VerifiedBadge />}
                            {token.verification_tier === 'silver' && <EstablishedBadge />}
                            {token.verification_tier === 'bronze' && <EmergingBadge />}
                            {token.verification_tier === 'gold' && <OfficialBadge />}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-base leading-tight text-foreground">{token.symbol}</div>
                          <div className="text-xs text-muted-foreground font-mono truncate max-w-[120px]">{token.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                       <span className="font-mono text-base text-signal font-semibold">
                          {token.verification_tier === 'blue' ? '92' : token.verification_tier === 'silver' ? '74' : '45'}
                       </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-sm">{formatCurrency(token.price_usd)}</td>
                    <td className={`px-3 py-2.5 text-right font-mono text-sm ${token.price_change_24h > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                      {token.price_change_24h > 0 ? '+' : ''}{token.price_change_24h}%
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-sm text-muted-foreground">${formatCompact(token.market_cap)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-sm text-muted-foreground">${formatCompact(token.liquidity_usd)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-sm text-muted-foreground">${formatCompact(token.volume_24h)}</td>
                    <td className="px-3 py-2.5 text-right">
                        {token.verification_tier === 'blue' && <span className="rounded border px-1.5 py-0.5 font-mono text-xs text-[#3fa9f5] border-[#3fa9f5]/40">VERIFIED</span>}
                        {token.verification_tier === 'silver' && <span className="rounded border px-1.5 py-0.5 font-mono text-xs text-muted-foreground border-border">ESTABLISHED</span>}
                        {token.verification_tier === 'bronze' && <span className="rounded border px-1.5 py-0.5 font-mono text-xs text-[#cd7f45] border-[#cd7f45]/40">EMERGING</span>}
                        {token.verification_tier === 'none' && <span className="rounded border px-1.5 py-0.5 font-mono text-xs text-muted-foreground border-border">UNVERIFIED</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* How to read this section */}
      <div className="grid grid-cols-12 gap-5 max-w-6xl pt-8">
        <div className="col-span-12">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-[0.34em] text-signal">02</span>
            <h2 className="uppercase font-display tracking-tight text-[15px] sm:text-[17px] leading-none">Reading the data</h2>
            <div className="h-px bg-border flex-1"></div>
          </div>
        </div>
        
        <div className="bento-card p-5 col-span-12 lg:col-span-7">
          <h3 className="font-display text-sm font-semibold">How to read this</h3>
          <p className="mt-1 text-xs text-muted-foreground">What the badges and the 0-100 score mean, and why some rows have no score yet.</p>
          
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-1.5">
                <OfficialBadge /> <span className="font-mono text-xs text-muted-foreground">Official</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <VerifiedBadge /> <span className="font-mono text-xs text-muted-foreground">Verified project</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <EstablishedBadge /> <span className="font-mono text-xs text-muted-foreground">Established</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <EmergingBadge /> <span className="font-mono text-xs text-muted-foreground">Emerging</span>
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground">Rows without a score have not been deep-scanned yet. Open one and the full report is built on the spot.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
