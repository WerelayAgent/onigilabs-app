"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
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
  verification_tier: string;
};

export default function WatchlistPage() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch only saved tokens from localStorage or a DB.
    // For now, we simulate fetching the watchlist.
    axios.get("/api/tokens")
      .then(res => {
        // Just take the first 3 tokens to simulate a watchlist
        setTokens((res.data.tokens || []).slice(0, 3));
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
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.34em] text-signal">RESEARCH</span>
        <h2 className="uppercase font-display tracking-tight text-lg leading-none">Watchlist</h2>
        <div className="h-px bg-border flex-1"></div>
      </div>

      <p className="text-sm text-muted-foreground font-mono">Your saved and monitored contracts.</p>

      <div className="bento-card overflow-hidden mt-6">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1180px] text-left">
            <thead>
              <tr className="border-b border-border font-mono text-[10px] tracking-[0.14em] text-muted-foreground bg-[var(--hover-surface)]">
                <th className="px-3 py-2.5 font-normal text-left w-8">★</th>
                <th className="px-3 py-2.5 font-normal text-left">TOKEN</th>
                <th className="px-3 py-2.5 font-normal text-right">SCORE</th>
                <th className="px-3 py-2.5 font-normal text-right">PRICE</th>
                <th className="px-3 py-2.5 font-normal text-right">24H</th>
                <th className="px-3 py-2.5 font-normal text-right">MCAP</th>
                <th className="px-3 py-2.5 font-normal text-right">LIQ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground font-mono text-xs">Loading watchlist data...</td>
                </tr>
              ) : tokens.length === 0 ? (
                 <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground font-mono text-sm">Your watchlist is empty. Go to the Scanner to add tokens.</td>
                </tr>
              ) : tokens.map((token) => (
                <tr key={token.address} className="hover:bg-white/5 transition-colors group">
                  <td className="px-3 py-2.5">
                    <Star className="w-3.5 h-3.5 text-signal fill-signal transition-colors" />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {token.icon_url ? (
                          <Image src={token.icon_url} alt={token.symbol} width={24} height={24} className="rounded-full bg-border" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-border" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm leading-tight text-foreground">{token.symbol}</div>
                        <div className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">{token.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-sm text-signal font-semibold">92</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sm">{formatCurrency(token.price_usd)}</td>
                  <td className={`px-3 py-2.5 text-right font-mono text-sm ${token.price_change_24h > 0 ? 'text-[#73ffb8]' : 'text-[#ff6b6b]'}`}>
                    {token.price_change_24h > 0 ? '+' : ''}{token.price_change_24h}%
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-sm text-muted-foreground">${formatCompact(token.market_cap)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-sm text-muted-foreground">${formatCompact(token.liquidity_usd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}