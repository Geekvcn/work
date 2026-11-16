export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'GET') {
    const raw = await env.PRODUCTION_KV.get('catl_worker_data');
    return new Response(raw || '{}', {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      await env.PRODUCTION_KV.put('catl_worker_data', JSON.stringify(body));
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}