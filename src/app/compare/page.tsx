"use client";

import { useState } from "react";
import axios from "axios";
import { GitCompare, Search, Activity, ShieldAlert, ShieldCheck } from "lucide-react";
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
  dex_url: string;
};

export default function ComparePage() {
  const [addressA, setAddressA] = useState("");
  const [addressB, setAddressB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ tokenA: TokenData; tokenB: TokenData } | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressA || !addressB) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.get(`/api/compare?tokenA=${addressA}&tokenB=${addressB}`);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch token data");
    } finally {
      setLoading(false);
    }
  };

  const formatCompact = (val: number) =>
    new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(val);

  const getWinner = (valA: number, valB: number) => valA > valB ? 'A' : valB > valA ? 'B' : 'TIE';

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.34em] text-signal">RESEARCH</span>
        <h2 className="uppercase font-display tracking-tight text-lg leading-none">Contract Compare</h2>
        <div className="h-px bg-border flex-1"></div>
      </div>

      <p className="text-sm text-muted-foreground font-mono max-w-2xl">
        Input two contract addresses to spot lookalike scams and liquidity traps side-by-side.
      </p>

      <form onSubmit={handleCompare} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-muted-foreground ml-1">Token A (Official)</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              value={addressA}
              onChange={(e) => setAddressA(e.target.value)}
              placeholder="Paste contract A..." 
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-signal/60"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono text-muted-foreground ml-1">Token B (Suspect)</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              value={addressB}
              onChange={(e) => setAddressB(e.target.value)}
              placeholder="Paste contract B..." 
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-signal/60"
            />
          </div>
        </div>
        <button 
          type="submit"
          disabled={loading || !addressA || !addressB}
          className="md:col-span-2 bg-signal/10 hover:bg-signal/20 text-signal border border-signal/20 py-2.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
             <span className="animate-pulse">Fetching Indexer Data...</span>
          ) : (
             <><GitCompare className="w-4 h-4" /> Compare Tokens</>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> {error}
        </div>
      )}

      {result && (
        <div className="mt-8 grid grid-cols-2 gap-px bg-border overflow-hidden rounded-xl border border-border">
          
          {[result.tokenA, result.tokenB].map((token, idx) => (
             <div key={idx} className="bg-card p-6 space-y-6">
                <div className="flex items-center gap-4">
                  {token.icon_url ? (
                    <Image src={token.icon_url} alt={token.symbol} width={48} height={48} className="rounded-full bg-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center"><Activity className="w-5 h-5 text-muted-foreground" /></div>
                  )}
                  <div>
                    <h3 className="font-display text-xl">{token.symbol}</h3>
                    <p className="font-mono text-xs text-muted-foreground truncate w-32">{token.name}</p>
                  </div>
                </div>

                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span className={getWinner(result.tokenA.market_cap, result.tokenB.market_cap) === (idx===0?'A':'B') ? 'text-signal' : ''}>
                      ${formatCompact(token.market_cap)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Liquidity (USD)</span>
                    <span className={getWinner(result.tokenA.liquidity_usd, result.tokenB.liquidity_usd) === (idx===0?'A':'B') ? 'text-safe' : ''}>
                      ${formatCompact(token.liquidity_usd)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Volume (24h)</span>
                    <span>${formatCompact(token.volume_24h)}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-muted-foreground">Health Check</span>
                    {token.liquidity_usd > 10000 ? (
                      <span className="text-safe flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> High</span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Trap Risk</span>
                    )}
                  </div>
                </div>
             </div>
          ))}

        </div>
      )}
    </div>
  );
}