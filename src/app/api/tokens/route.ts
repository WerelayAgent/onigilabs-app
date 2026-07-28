import { NextResponse } from 'next/server';
import axios from 'axios';

// Top popular Solana meme/ecosystem tokens for the MVP scanner
const MVP_TOKENS = [
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // $WIF
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // $BONK
  '7GCihgDB8fe6KNjn2TWtkG3kZKkRcb6ZR9rXz8nFpump', // $BODEN
  'JUPyiwrYPRn4z3oEnr7AEEVokNqWkSsmxTqA11R4Y2Z',  // $JUP
  'HeLp6NuQcg1cvNnCDc52hP8ZJcKAD9C5E4ZqT9Knpump', // Some random pump.fun
  'So11111111111111111111111111111111111111112',  // $SOL (Wrapped)
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // $USDC
];

export async function GET() {
  try {
    const addresses = MVP_TOKENS.join(',');
    // Fetch live data from DexScreener
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${addresses}`);
    
    if (!response.data || !response.data.pairs) {
      return NextResponse.json({ tokens: [] });
    }

    // Deduplicate by token address (take the highest liquidity pair)
    const tokenMap = new Map();
    for (const pair of response.data.pairs) {
      if (pair.baseToken.address) {
        if (!tokenMap.has(pair.baseToken.address)) {
          tokenMap.set(pair.baseToken.address, pair);
        } else {
          const existing = tokenMap.get(pair.baseToken.address);
          if (pair.liquidity?.usd > (existing.liquidity?.usd || 0)) {
            tokenMap.set(pair.baseToken.address, pair);
          }
        }
      }
    }

    const tokens = Array.from(tokenMap.values()).map(pair => {
      // Determine badge tier
      let tier = 'none';
      if (pair.liquidity?.usd > 1000000) tier = 'blue';
      else if (pair.liquidity?.usd > 500000) tier = 'silver';
      else if (pair.liquidity?.usd > 50000) tier = 'bronze';

      return {
        address: pair.baseToken.address,
        name: pair.baseToken.name,
        symbol: pair.baseToken.symbol,
        icon_url: pair.info?.imageUrl || '',
        price_usd: parseFloat(pair.priceUsd || '0'),
        market_cap: pair.fdv || pair.marketCap || 0,
        liquidity_usd: pair.liquidity?.usd || 0,
        volume_24h: pair.volume?.h24 || 0,
        price_change_24h: pair.priceChange?.h24 || 0,
        holders_count: Math.floor(Math.random() * 50000), // DexScreener doesn't have holders, mock for MVP
        launched_at: new Date(pair.pairCreatedAt || Date.now()).toISOString(),
        dex_url: pair.url,
        verification_tier: tier,
      };
    });

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Error fetching token data:', error);
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 });
  }
}
