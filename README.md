# Site Aleatório Tech

Marketplace experimental de computação e tecnologia, com catálogo modular e painel simples para gerenciar links externos.

## Estrutura

- Catálogo estático em `index.html`, `app.js` e `style.css`.
- Plugins em `plugins/`.
- Painel em `admin.html`.
- API local em `server.js`.
- API para Cloudflare Pages em `functions/`.
- Links e senha administrativa persistidos em Cloudflare KV quando publicado na Cloudflare.

## Painel

Abra:

```
/admin
```

ou:

```
/admin.html
```

A senha inicial vem de `ADMIN_PASSWORD`. Dentro do painel ela pode ser alterada; a nova senha fica salva no KV e passa a substituir a senha inicial do ambiente.

## Cloudflare Pages

O projeto pode ser conectado diretamente ao GitHub. O diretório `functions/` é usado como Pages Functions.

Configure no projeto da Cloudflare:

```
ADMIN_PASSWORD=uma-senha-inicial
SESSION_SECRET=um-segredo-qualquer
```

Crie uma instância de **KV** e faça o binding com o nome exato:

```
LINKS_KV
```

Depois do deploy, teste:

```
/health
```

A resposta esperada é:

```json
{"ok":true,"service":"site-aleatorio","api":"cloudflare-pages-functions"}
```

As rotas administrativas ficam no mesmo domínio:

```
POST /api/admin/login
GET  /api/links
POST /api/links
DELETE /api/links/:id
POST /api/admin/password
```

### Por que existe também server.js?

Para desenvolvimento local com Node. No Cloudflare Pages, as rotas de `functions/` assumem o lugar dele.

## Desenvolvimento local com Node

```bash
cp .env.example .env
npm start
```

A API local usa `data/links.json`.

## Desenvolvimento local com Cloudflare

Copie `.dev.vars.example` para `.dev.vars` e use Wrangler/Pages dev com um binding KV chamado `LINKS_KV`.

> `.env` e `.dev.vars` não devem ser enviados ao GitHub.