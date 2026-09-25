export async function onRequestGet() {
  return Response.json({ ok: true, service: 'site-aleatorio', api: 'cloudflare-pages-functions' });
}