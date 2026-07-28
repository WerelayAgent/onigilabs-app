import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // Fetch live trending pairs from DexScreener to simulate a massive table
    const [resSol, resPump] = await Promise.all([
      axios.get(`https://api.dexscreener.com/latest/dex/search?q=sol`),
      axios.get(`https://api.dexscreener.com/latest/dex/search?q=pump`)
    ]);
    
    let allPairs = [...(resSol.data.pairs || []), ...(resPump.data.pairs || [])];
    
    // Filter to only Solana chain
    allPairs = allPairs.filter((p: any) => p.chainId === 'solana');

    // Deduplicate by token address (take the highest liquidity pair)
    const tokenMap = new Map();
    for (const pair of allPairs) {
      if (pair.baseToken.address) {
        if (!tokenMap.has(pair.baseToken.address)) {
          tokenMap.set(pair.baseToken.address, pair);
        } else {
          const existing = tokenMap.get(pair.baseToken.address);
          if ((pair.liquidity?.usd || 0) > (existing.liquidity?.usd || 0)) {
            tokenMap.set(pair.baseToken.address, pair);
          }
        }
      }
    }

    const tokens = Array.from(tokenMap.values()).map(pair => {
      // Determine badge tier
      let tier = 'none';
      if (pair.liquidity?.usd > 500000) tier = 'gold';
      else if (pair.liquidity?.usd > 100000) tier = 'blue';
      else if (pair.liquidity?.usd > 10000) tier = 'silver';
      else tier = 'bronze';

      const s_diff = (Math.random() * 20 - 10).toFixed(1); // Mock -10 to +10
      const r_score = Math.floor(Math.random() * 100);
      const sniped = Math.floor(Math.random() * 15) + "%";
      const top10 = (Math.random() * 50 + 20).toFixed(1) + "%";
      const holders = (Math.random() * 10).toFixed(1) + "K";
      const score = Math.floor(Math.random() * 40) + 60; // 60-99

      return {
        address: pair.baseToken.address,
        name: pair.baseToken.name,
        symbol: pair.baseToken.symbol,
        icon_url: pair.info?.imageUrl || '',
        
        // Exact screenshot columns
        score: score,
        s_diff: s_diff,
        r_score: r_score,
        sniped: sniped,
        price_usd: parseFloat(pair.priceUsd || '0'),
        price_change_24h: pair.priceChange?.h24 || 0,
        market_cap: pair.fdv || pair.marketCap || 0,
        off_api: Math.random() > 0.8 ? "YES" : "-",
        liquidity_usd: pair.liquidity?.usd || 0,
        volume_24h: pair.volume?.h24 || 0,
        top_10: top10,
        holders: holders,

        dex_url: pair.url,
        verification_tier: tier,
      };
    });

    // Sort by liquidity descending to make it look realistic
    tokens.sort((a, b) => b.liquidity_usd - a.liquidity_usd);

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Error fetching token data:', error);
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 });
  }
}
