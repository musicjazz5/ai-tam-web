// Cloudflare Pages Function — proxies theme_maps_latest.json from ai-tam.org
// Runs on Cloudflare Edge, avoids CORS issues for browser requests
export async function onRequest(context) {
  const upstream = 'https://ai-tam.org/market-scan/api/public-data/theme_maps_latest.json';

  try {
    const resp = await fetch(upstream, {
      headers: { 'User-Agent': 'ai-tam-web/1.0' },
      cf: { cacheTtl: 300, cacheEverything: true },
    });

    if (!resp.ok) {
      return new Response(JSON.stringify({ error: `upstream ${resp.status}` }), {
        status: resp.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
