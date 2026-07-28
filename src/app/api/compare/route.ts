import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenA = searchParams.get('tokenA');
  const tokenB = searchParams.get('tokenB');

  if (!tokenA || !tokenB) {
    return NextResponse.json({ error: 'Missing token addresses' }, { status: 400 });
  }

  try {
    // Fetch both tokens concurrently from DexScreener
    const [resA, resB] = await Promise.all([
      fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenA}`),
      fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenB}`)
    ]);

    const dataA = await resA.json();
    const dataB = await resB.json();

    // Extract the primary Solana pair for each token
    const pairA = dataA.pairs?.find((p: any) => p.chainId === 'solana') || null;
    const pairB = dataB.pairs?.find((p: any) => p.chainId === 'solana') || null;

    if (!pairA) return NextResponse.json({ error: `Token A (${tokenA}) not found on Solana` }, { status: 404 });
    if (!pairB) return NextResponse.json({ error: `Token B (${tokenB}) not found on Solana` }, { status: 404 });

    const formatToken = (pair: any) => ({
      address: pair.baseToken.address,
      name: pair.baseToken.name,
      symbol: pair.baseToken.symbol,
      icon_url: pair.info?.imageUrl || '',
      price_usd: parseFloat(pair.priceUsd || '0'),
      market_cap: pair.fdv || pair.marketCap || 0,
      liquidity_usd: pair.liquidity?.usd || 0,
      volume_24h: pair.volume?.h24 || 0,
      price_change_24h: pair.priceChange?.h24 || 0,
      dex_url: pair.url,
      created_at: pair.pairCreatedAt || Date.now()
    });

    return NextResponse.json({
      tokenA: formatToken(pairA),
      tokenB: formatToken(pairB)
    });
  } catch (error) {
    console.error('Error fetching compare data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
