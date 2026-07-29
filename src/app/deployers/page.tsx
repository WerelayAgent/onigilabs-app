"use client";

import { useState } from "react";
import axios from "axios";
import { Search, ShieldAlert, Code2, Clock, AlertTriangle } from "lucide-react";

type DeployerData = {
  address: string;
  total_transactions_scanned: number;
  last_active: string;
  risk_score: number;
  deployments: Array<{
    symbol: string;
    name: string;
    status: string;
    date: string;
  }>;
};

export default function DeployersPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<DeployerData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.get(`/api/deployers?address=${address}`);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch deployer data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.34em] text-signal">INTELLIGENCE</span>
        <h2 className="uppercase font-display tracking-tight text-lg leading-none">Deployers</h2>
        <div className="h-px bg-border flex-1"></div>
      </div>

      <p className="text-sm text-muted-foreground font-mono">
        Track serial token creators. Input a wallet address to scan the blockchain for all tokens they have historically deployed.
      </p>

      <form onSubmit={handleSearch} className="flex gap-4 mt-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Paste Robinhood Chain wallet address..." 
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-signal/60"
          />
        </div>
        <button 
          type="submit"
          disabled={loading || !address}
          className="bg-signal/10 hover:bg-signal/20 text-signal border border-signal/20 px-6 py-2.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "Scanning..." : "Scan Wallet"}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> {error}
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bento-card p-5">
              <div className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><Code2 className="w-3.5 h-3.5"/> TX Scanned</div>
              <div className="font-display text-2xl">{result.total_transactions_scanned}</div>
            </div>
            <div className="bento-card p-5">
              <div className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><Clock className="w-3.5 h-3.5"/> Last Active</div>
              <div className="font-mono text-sm">{result.last_active !== 'Unknown' ? new Date(result.last_active).toLocaleDateString() : 'Unknown'}</div>
            </div>
            <div className="bento-card p-5">
              <div className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5"/> Risk Score</div>
              <div className={`font-display text-2xl ${result.risk_score > 50 ? 'text-red-500' : 'text-safe'}`}>{result.risk_score}/100</div>
            </div>
          </div>

          <h3 className="font-display text-sm mt-8">Past Deployments Found</h3>
          <div className="bento-card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border font-mono text-[10px] tracking-[0.14em] text-muted-foreground bg-[var(--hover-surface)]">
                  <th className="px-4 py-3 font-normal">TICKER</th>
                  <th className="px-4 py-3 font-normal">NAME</th>
                  <th className="px-4 py-3 font-normal">DATE</th>
                  <th className="px-4 py-3 font-normal text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {result.deployments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground font-mono text-sm">No token deployments found for this address.</td>
                  </tr>
                ) : result.deployments.map((dep, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-semibold text-sm">{dep.symbol}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{dep.name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{dep.date}</td>
                    <td className="px-4 py-3 text-right">
                       <span className={`rounded border px-2 py-0.5 font-mono text-[10px] ${dep.status === 'Active' ? 'text-safe border-safe/40' : 'text-red-500 border-red-500/40'}`}>
                         {dep.status.toUpperCase()}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}