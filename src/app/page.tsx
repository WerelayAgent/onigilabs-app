"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Radar, Activity } from "lucide-react";
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

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: val < 1 ? 4 : 0 }).format(val);

  const formatCompact = (val: number) =>
    new Intl.NumberFormat("en-US", { notation: "compact" }).format(val);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="bento-card p-8 lg:col-span-7 flex flex-col justify-center">
          <div className="text-[10px] font-mono tracking-widest text-signal uppercase flex items-center gap-2 mb-6">
            <Radar className="w-4 h-4" />
            <span>On-chain forensics · Solana Mainnet</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display leading-[1.1] tracking-tight">
            Find out<br />who really owns<br />the coin.
          </h1>
          <div className="w-12 h-px bg-signal mt-6 mb-4"></div>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed">
            Every token on Solana, scored. Deployer history, holder clusters, liquidity locks and wallet links in one report.
          </p>
        </div>
        
        <div className="bento-card p-6 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">System Status</span>
              <span className="flex items-center gap-2 bg-safe/10 text-safe border border-safe/20 px-2 py-0.5 rounded-full text-[10px] font-mono">
                <span className="w-1.5 h-1.5 bg-safe rounded-full blip"></span>
                STABLE
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm border-b border-border pb-3">
                <span className="text-gray-400">Network</span>
                <span className="font-mono">Solana</span>
              </div>
              <div className="flex justify-between text-sm border-b border-border pb-3">
                <span className="text-gray-400">Coverage</span>
                <span className="font-mono">Pump.fun & Raydium</span>
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-border rounded-lg p-3 mt-6 flex items-center gap-3">
            <Activity className="w-4 h-4 text-signal" />
            <span className="text-xs uppercase font-display tracking-wide">Indexer Live</span>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono tracking-widest text-signal">01</span>
          <h2 className="uppercase font-display tracking-tight text-lg">Tokens</h2>
          <div className="h-px bg-border flex-1"></div>
        </div>

        <div className="bento-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-card border-b border-border font-mono text-[10px] tracking-wider text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">ASSET</th>
                  <th className="px-4 py-3 font-medium text-right">PRICE</th>
                  <th className="px-4 py-3 font-medium text-right">24H VOL</th>
                  <th className="px-4 py-3 font-medium text-right">LIQUIDITY</th>
                  <th className="px-4 py-3 font-medium text-right">MCAP</th>
                  <th className="px-4 py-3 font-medium">TIER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 font-mono text-xs">Loading live scanner data...</td>
                  </tr>
                ) : tokens.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 font-mono text-xs">No tokens found.</td>
                  </tr>
                ) : (
                  tokens.map(token => (
                    <tr key={token.address} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => window.open(token.dex_url, "_blank")}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {token.icon_url ? (
                            <Image src={token.icon_url} alt={token.symbol} width={24} height={24} className="rounded-full bg-border" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-border" />
                          )}
                          <div>
                            <div className="font-semibold">{token.symbol}</div>
                            <div className="text-[10px] text-gray-500 font-mono">{token.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[13px]">{formatCurrency(token.price_usd)}</td>
                      <td className="px-4 py-3 text-right font-mono text-[13px] text-gray-300">{formatCurrency(token.volume_24h)}</td>
                      <td className="px-4 py-3 text-right font-mono text-[13px] text-gray-300">{formatCurrency(token.liquidity_usd)}</td>
                      <td className="px-4 py-3 text-right font-mono text-[13px] text-gray-300">{formatCompact(token.market_cap)}</td>
                      <td className="px-4 py-3">
                        {token.verification_tier === 'blue' && <span className="text-[10px] font-mono text-blue-400 border border-blue-400/30 bg-blue-400/10 px-2 py-0.5 rounded uppercase">Verified</span>}
                        {token.verification_tier === 'silver' && <span className="text-[10px] font-mono text-gray-300 border border-gray-400/30 bg-gray-400/10 px-2 py-0.5 rounded uppercase">Established</span>}
                        {token.verification_tier === 'bronze' && <span className="text-[10px] font-mono text-orange-400 border border-orange-400/30 bg-orange-400/10 px-2 py-0.5 rounded uppercase">Emerging</span>}
                        {token.verification_tier === 'none' && <span className="text-[10px] font-mono text-gray-500 border border-gray-500/30 bg-gray-500/10 px-2 py-0.5 rounded uppercase">Unverified</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
