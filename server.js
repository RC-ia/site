const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const LINKS_FILE = path.join(DATA_DIR, 'links.json');
const ENV_FILE = path.join(ROOT, '.env');
const PORT = Number(process.env.PORT || 3000);

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(LINKS_FILE)) fs.writeFileSync(LINKS_FILE, '[]', 'utf8');

function loadDotEnv() {
  if (!fs.existsSync(ENV_FILE)) return;
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split(/\\r?\\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\\1$/, '$2');
    }
  }
}
loadDotEnv();

let adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
const sessions = new Set();

function readLinks() {
  try { return JSON.parse(fs.readFileSync(LINKS_FILE, 'utf8')); }
  catch { return []; }
}

function writeLinks(links) {
  fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2) + '\\n', 'utf8');
}

function updateEnvPassword(password) {
  let lines = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, 'utf8').split(/\\r?\\n/) : [];
  let found = false;
  lines = lines.filter(line => {
    if (/^ADMIN_PASSWORD=/.test(line)) {
      if (!found) {
        found = true;
        return false;
      }
      return false;
    }
    return true;
  }).filter(Boolean);
  lines.unshift('ADMIN_PASSWORD=' + password.replace(/\\r|\\n/g, ''));
  fs.writeFileSync(ENV_FILE, lines.join('\n') + '\n', 'utf8');
  process.env.ADMIN_PASSWORD = password;
}

function json(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

function body(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 200_000) req.destroy();
    });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(new Error('JSON inválido')); }
    });
    req.on('error', reject);
  });
}

function auth(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  return token && sessions.has(token);
}

function safePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const requested = clean === '/' ? '/index.html' : clean;
  const target = path.normalize(path.join(ROOT, requested));
  return target.startsWith(ROOT) ? target : null;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function serveFile(target, res) {
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    return json(res, 404, { error: 'Não encontrado.' });
  }
  const ext = path.extname(target).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(target).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  try {
    if (url.pathname === '/health' && req.method === 'GET') {
      return json(res, 200, { ok: true, service: 'site-aleatorio', api: true });
    }

    if (url.pathname === '/api/links' && req.method === 'GET') {
      return json(res, 200, readLinks());
    }

    if (url.pathname === '/api/admin/login' && req.method === 'POST') {
      const data = await body(req);
      if (String(data.password || '') !== String(adminPassword)) {
        return json(res, 401, { error: 'Senha incorreta.' });
      }
      const token = crypto.randomBytes(24).toString('hex');
      sessions.add(token);
      return json(res, 200, { token });
    }

    if (url.pathname === '/api/links' && req.method === 'POST') {
      if (!auth(req)) return json(res, 401, { error: 'Não autorizado.' });
      const data = await body(req);
      if (!data.name || !data.url) return json(res, 400, { error: 'Nome e URL são obrigatórios.' });
      let parsed;
      try { parsed = new URL(data.url); }
      catch { return json(res, 400, { error: 'URL inválida.' }); }
      if (!['http:', 'https:'].includes(parsed.protocol)) return json(res, 400, { error: 'Use http ou https.' });

      const link = {
        id: crypto.randomUUID(),
        name: String(data.name).slice(0, 120),
        url: parsed.toString(),
        source: String(data.source || 'Loja').slice(0, 60),
        category: String(data.category || 'Diversos').slice(0, 60),
        price: data.price ? String(data.price).slice(0, 30) : '',
        image: data.image ? String(data.image).slice(0, 500) : '',
        createdAt: new Date().toISOString(),
      };
      const links = readLinks();
      links.unshift(link);
      writeLinks(links);
      return json(res, 201, link);
    }

    if (url.pathname.startsWith('/api/links/') && req.method === 'DELETE') {
      if (!auth(req)) return json(res, 401, { error: 'Não autorizado.' });
      const id = decodeURIComponent(url.pathname.split('/').pop());
      const links = readLinks();
      const next = links.filter(link => link.id !== id);
      if (next.length === links.length) return json(res, 404, { error: 'Link não encontrado.' });
      writeLinks(next);
      return json(res, 200, { ok: true });
    }

    if (url.pathname === '/api/admin/password' && req.method === 'POST') {
      if (!auth(req)) return json(res, 401, { error: 'Não autorizado.' });
      const data = await body(req);
      const nextPassword = String(data.password || '');
      if (nextPassword.length < 4) return json(res, 400, { error: 'Use pelo menos 4 caracteres.' });
      adminPassword = nextPassword;
      sessions.clear();
      updateEnvPassword(nextPassword);
      return json(res, 200, { ok: true });
    }

    if (url.pathname === '/admin') {
      return serveFile(path.join(ROOT, 'admin.html'), res);
    }

    const target = safePath(url.pathname);
    if (!target) return json(res, 403, { error: 'Acesso negado.' });
    return serveFile(target, res);
  } catch (error) {
    console.error(error);
    json(res, 500, { error: error.message || 'Erro interno.' });
  }
});

server.listen(PORT, () => {
  console.log('Site Aleatório rodando em http://localhost:' + PORT);
  console.log('Painel: http://localhost:' + PORT + '/admin.html');
});