const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  },
});

function kv(context) {
  if (!context.env?.LINKS_KV) throw new Error('KV binding LINKS_KV não configurada.');
  return context.env.LINKS_KV;
}

async function getPassword(context) {
  const store = kv(context);
  return (await store.get('admin_password')) || context.env.ADMIN_PASSWORD || 'admin123';
}

async function setPassword(context, password) {
  await kv(context).put('admin_password', password);
}

function base64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlText(text) {
  return base64url(new TextEncoder().encode(text));
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return base64url(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)));
}

async function issueToken(context) {
  const secret = context.env?.SESSION_SECRET || 'change-me-session-secret';
  const payload = { iat: Date.now() };
  const encoded = base64urlText(JSON.stringify(payload));
  return encoded + '.' + await sign(encoded, secret);
}

async function validToken(context, request) {
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return false;
  const token = header.slice(7);
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const secret = context.env?.SESSION_SECRET || 'change-me-session-secret';
  const expected = await sign(payload, secret);
  if (expected !== signature) return false;
  try {
    const data = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return Date.now() - Number(data.iat) < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

async function getLinks(context) {
  const raw = await kv(context).get('links');
  return raw ? JSON.parse(raw) : [];
}

async function saveLinks(context, links) {
  await kv(context).put('links', JSON.stringify(links));
}

async function readRequestJson(request) {
  try {
    return await request.json();
  } catch {
    throw new Error('JSON inválido.');
  }
}

export { json, kv, getPassword, setPassword, issueToken, validToken, getLinks, saveLinks, readRequestJson };