# Site Aleatório API Worker

Este Worker contém apenas a API administrativa do site.

O Pages continua responsável pelos arquivos estáticos. O Worker deve receber somente:

`central.rcscan.online/api/*`

## Configuração

Crie um KV Namespace no Cloudflare.

No Worker, adicione o binding:

`LINKS_KV`

Depois configure os secrets:

```
ADMIN_PASSWORD
SESSION_SECRET
```

A documentação do Cloudflare recomenda usar secrets para valores sensíveis, em vez de colocá-los em `vars` ou no código. citeturn308055search3turn308055search7

## Route

Crie uma Worker Route:

```
central.rcscan.online/api/*
```

O restante do domínio continua indo para o Pages.

## Teste

```
GET https://central.rcscan.online/api/health
```

Resposta:

```json
{"ok":true,"service":"site-aleatorio-api"}
```

O KV armazena:

- `links` — lista de ofertas.
- `admin_password` — senha alterada pelo painel.

O binding KV é a forma nativa do Workers de acessar um namespace KV. citeturn308055search4