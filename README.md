# Site Aleatório Tech

Marketplace experimental de computação e tecnologia, com catálogo modular e painel simples para gerenciar links externos.

## Como está publicado

O site foi pensado para **Cloudflare Pages usando Direct Upload**. Nesse modo, a pasta `functions/` não é compilada pelo upload do dashboard. O formato `_worker.js`, entretanto, é suportado pelo Direct Upload e pode interceptar as requisições antes de devolver os arquivos estáticos. citeturn838923search1turn838923search0

Arquitetura:

```text
central.rcscan.online
       │
       └── _worker.js
             ├── /api/*  → API
             └── demais  → arquivos estáticos
```

## Painel

Abra:

```
/admin
```

ou:

```
/admin.html
```

O painel permite cadastrar links de Amazon e outras lojas, além de trocar a senha.

## Configuração

No projeto que executa o `_worker.js`, configure:

```
ADMIN_PASSWORD
SESSION_SECRET
```

e um binding KV chamado:

```
LINKS_KV
```

Workers permite configurar variáveis/secrets pelo dashboard e ligar namespaces KV por binding. citeturn838923search6turn838923search7

A senha inicial é `ADMIN_PASSWORD`. Quando ela é alterada pelo painel, a nova senha é guardada no KV.

## Teste

Depois do upload:

```
https://central.rcscan.online/api/health
```

deve retornar:

```json
{"ok":true,"service":"site-aleatorio-api"}
```

## Arquivos principais

```text
/
├── _worker.js
├── index.html
├── admin.html
├── app.js
├── style.css
├── package.json
├── server.js
├── data/
│   └── links.json
└── plugins/
    ├── core.js
    ├── manifest.js
    ├── hardware.plugin.js
    ├── peripherals.plugin.js
    ├── software.plugin.js
    └── other.plugin.js
```

`server.js` continua disponível para desenvolvimento local com Node; no Pages Direct Upload, o ponto de entrada web é `_worker.js`.

> Para um sistema realmente simples, não é necessário usar as APIs das lojas: os links cadastrados podem ser links de afiliado ou links comuns, e o site apenas os exibe.
