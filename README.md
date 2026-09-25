# Site Aleatório Tech

Marketplace experimental de computação e tecnologia, com catálogo modular e painel simples para gerenciar links externos.

## Arquitetura

O site pode continuar sendo publicado como **Pages Direct Upload**. O arquivo especial `_worker.js` intercepta somente `/api/*`; todo o restante continua sendo servido como arquivo estático pelo Pages.

```text
navegador
   │
   ▼
central.rcscan.online
   │
   ├── /admin.html ──→ arquivo estático
   ├── /index.html ──→ arquivo estático
   └── /api/* ───────→ _worker.js ──→ KV
```

O Cloudflare documenta que `_worker.js` pode ser usado no modo avançado para assumir o tratamento das requisições e que `env.ASSETS.fetch(request)` devolve os arquivos estáticos. O Direct Upload também documenta suporte ao `_worker.js`. 

## Painel

Abra:

```
/admin
```

ou:

```
/admin.html
```

A senha inicial vem de `ADMIN_PASSWORD`. Depois, ela pode ser trocada pelo próprio painel e a nova senha fica no KV.

## Configuração do Cloudflare

No projeto Pages, adicione uma instância de **Workers KV** e crie o binding:

```
LINKS_KV
```

Depois adicione como secret:

```
ADMIN_PASSWORD
```

e outro secret:

```
SESSION_SECRET
```

Não coloque esses valores no GitHub. O Cloudflare disponibiliza secrets e bindings pelo objeto `env` em runtime.

Depois de fazer um novo upload incluindo `_worker.js`, teste:

```
https://central.rcscan.online/api/health
```

Resposta esperada:

```json
{"ok":true,"service":"site-aleatorio-api"}
```

## API

```
GET    /api/health
GET    /api/links
POST   /api/admin/login
POST   /api/admin/password
POST   /api/links
DELETE /api/links/:id
```

## Local

O `server.js` continua disponível para rodar o projeto localmente com Node.