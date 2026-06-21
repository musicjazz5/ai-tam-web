export async function GET() {
  const upstream = 'https://ai-tam.org/market-scan/api/public-data/theme_maps_latest.json';

  try {
    const resp = await fetch(upstream, {
      headers: { 'User-Agent': 'ai-tam-web/1.0' },
    });

    if (!resp.ok) {
      return Response.json({ error: `upstream ${resp.status}` }, { status: resp.status });
    }

    const data = await resp.json();

    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 502 });
  }
}
