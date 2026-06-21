const UPSTREAM = 'https://ai-tam.org/market-scan/api/public-data/theme_maps_latest.json';
const CACHE_TTL = 300; // 5 minutes

export async function GET() {
  try {
    // Use Cloudflare's cf fetch options for edge caching
    const resp = await fetch(UPSTREAM, {
      headers: { 'User-Agent': 'ai-tam-web/1.0' },
      // @ts-ignore — cf is Cloudflare Workers-specific
      cf: { cacheTtl: CACHE_TTL, cacheEverything: true },
    });

    if (!resp.ok) {
      return Response.json({ error: `upstream ${resp.status}` }, { status: resp.status });
    }

    const data = await resp.json();

    return Response.json(data, {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL * 2}`,
        'Access-Control-Allow-Origin': '*',
        'CDN-Cache-Control': `max-age=${CACHE_TTL}`,
      },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 502 });
  }
}
