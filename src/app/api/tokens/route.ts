import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // Fetch directly from pump.fun's frontend API to get only pump.fun tokens
    const pumpRes = await axios.get(`https://frontend-api.pump.fun/coins/latest`);
    
    let pumpTokens = pumpRes.data || [];
    // Just take top 50 to render
    pumpTokens = pumpTokens.slice(0, 50);

    const tokens = pumpTokens.map((coin: any) => {
      // Determine badge tier based on market cap (usd_market_cap)
      let tier = 'none';
      const mcap = coin.usd_market_cap || 0;
      if (mcap > 500000) tier = 'gold';
      else if (mcap > 100000) tier = 'blue';
      else if (mcap > 10000) tier = 'silver';
      else tier = 'bronze';

      const s_diff = (Math.random() * 20 - 10).toFixed(1); // Mock -10 to +10
      const r_score = Math.floor(Math.random() * 100);
      const sniped = Math.floor(Math.random() * 15) + "%";
      const top10 = (Math.random() * 50 + 20).toFixed(1) + "%";
      const holders = (Math.random() * 10).toFixed(1) + "K";
      const score = Math.floor(Math.random() * 40) + 60; // 60-99

      return {
        address: coin.mint,
        name: coin.name,
        symbol: coin.symbol,
        icon_url: coin.image_uri || '',
        
        // Exact screenshot columns
        score: score,
        s_diff: s_diff,
        r_score: r_score,
        sniped: sniped,
        // Pump.fun API doesn't provide price natively, we calculate it or mock it
        price_usd: (mcap / 1_000_000_000).toFixed(8), // rough approximation based on 1B supply
        price_change_24h: (Math.random() * 40 - 20), // Mock 24h change
        market_cap: mcap,
        off_api: Math.random() > 0.8 ? "YES" : "-",
        // Mock liquidity and volume since Pump API doesn't give them natively in this endpoint
        liquidity_usd: mcap * 0.1, 
        volume_24h: mcap * 0.5,
        top_10: top10,
        holders: holders,

        dex_url: `https://pump.fun/${coin.mint}`,
        verification_tier: tier,
      };
    });

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Error fetching pump.fun data:', error);
    return NextResponse.json({ error: 'Failed to fetch tokens from pump.fun' }, { status: 500 });
  }
}
