const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  }
});

async function getLinks(env) {
  const raw = await env.LINKS_KV.get("links");
  return raw ? JSON.parse(raw) : [];
}

async function saveLinks(env, links) {
  await env.LINKS_KV.put("links", JSON.stringify(links));
}

async function getPassword(env) {
  return (await env.LINKS_KV.get("admin_password")) || env.ADMIN_PASSWORD || "admin123";
}

function bytesToBase64Url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function textToBase64Url(text) {
  return bytesToBase64Url(new TextEncoder().encode(text));
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  return bytesToBase64Url(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))
  );
}

async function createToken(env) {
  const payload = textToBase64Url(JSON.stringify({ iat: Date.now() }));
  const secret = env.SESSION_SECRET || "change-this-secret";
  return payload + "." + await sign(payload, secret);
}

async function validToken(request, env) {
  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Bearer ")) return false;

  const token = header.slice(7);
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await sign(
    payload,
    env.SESSION_SECRET || "change-this-secret"
  );

  if (signature !== expected) return false;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const data = JSON.parse(atob(normalized));
    return Date.now() - Number(data.iat) < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new Error("JSON inválido.");
  }
}

function cleanText(value, max) {
  return String(value || "").replace(/[\r\n]/g, " ").slice(0, max);
}

async function handle(request, env) {
  const url = new URL(request.url);

  if (url.pathname === "/api/health" && request.method === "GET") {
    return json({ ok: true, service: "site-aleatorio-api" });
  }

  if (url.pathname === "/api/links" && request.method === "GET") {
    return json(await getLinks(env));
  }

  if (url.pathname === "/api/admin/login" && request.method === "POST") {
    const data = await readJson(request);
    const password = String(data.password || "");

    if (password !== await getPassword(env)) {
      return json({ error: "Senha incorreta." }, 401);
    }

    return json({ token: await createToken(env) });
  }

  if (url.pathname === "/api/admin/password" && request.method === "POST") {
    if (!await validToken(request, env)) {
      return json({ error: "Não autorizado." }, 401);
    }

    const data = await readJson(request);
    const password = String(data.password || "");

    if (password.length < 4) {
      return json({ error: "Use pelo menos 4 caracteres." }, 400);
    }

    await env.LINKS_KV.put("admin_password", password);
    return json({ ok: true });
  }

  if (url.pathname === "/api/links" && request.method === "POST") {
    if (!await validToken(request, env)) {
      return json({ error: "Não autorizado." }, 401);
    }

    const data = await readJson(request);
    if (!data.name || !data.url) {
      return json({ error: "Nome e URL são obrigatórios." }, 400);
    }

    let parsed;
    try {
      parsed = new URL(data.url);
    } catch {
      return json({ error: "URL inválida." }, 400);
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return json({ error: "A URL precisa usar http ou https." }, 400);
    }

    const link = {
      id: crypto.randomUUID(),
      name: cleanText(data.name, 120),
      url: parsed.toString(),
      source: cleanText(data.source || "Loja", 60),
      category: cleanText(data.category || "Diversos", 60),
      price: cleanText(data.price, 30),
      image: cleanText(data.image, 500),
      createdAt: new Date().toISOString()
    };

    const links = await getLinks(env);
    links.unshift(link);
    await saveLinks(env, links);

    return json(link, 201);
  }

  const match = url.pathname.match(/^\/api\/links\/([^/]+)$/);
  if (match && request.method === "DELETE") {
    if (!await validToken(request, env)) {
      return json({ error: "Não autorizado." }, 401);
    }

    const id = decodeURIComponent(match[1]);
    const links = await getLinks(env);
    const next = links.filter(link => link.id !== id);

    if (next.length === links.length) {
      return json({ error: "Link não encontrado." }, 404);
    }

    await saveLinks(env, next);
    return json({ ok: true });
  }

  return json({ error: "Rota não encontrada." }, 404);
}

export default {
  async fetch(request, env) {
    try {
      return await handle(request, env);
    } catch (error) {
      console.error(error);
      return json({ error: error.message || "Erro interno." }, 500);
    }
  }
};