# Site Aleatório Tech

Marketplace experimental de computação e tecnologia, com catálogo modular e um painel simples para gerenciar links externos.

## O que tem

- Catálogo de hardware, periféricos, software e itens diversos.
- Busca instantânea e filtros.
- Carrinho demonstrativo persistido em `localStorage`.
- Sistema de plugins para adicionar categorias e produtos.
- Links externos cadastrados pelo painel administrativo.
- API Node mínima para servir o site e persistir `data/links.json`.
- Senha administrativa carregada de `.env`.

## Estrutura

```text
/
├── index.html
├── app.js
├── style.css
├── server.js
├── admin.html
├── package.json
├── .env.example
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

## Rodar

1. Copie `.env.example` para `.env`.
2. Escolha a senha em `ADMIN_PASSWORD`.
3. Execute:

```bash
npm start
```

4. Abra `http://localhost:3000/`.
5. O painel fica em `http://localhost:3000/admin.html`.

A senha pode ser trocada dentro do painel. A nova senha é gravada no `.env`; o arquivo está no `.gitignore`.

## Cadastrar um link

No painel, informe nome, URL, loja/origem, categoria, preço e opcionalmente uma URL de imagem. O link aparece automaticamente na área **Ofertas externas** do catálogo.

> Observação: essa API foi pensada para uma hospedagem Node simples. GitHub Pages, sozinho, não executa o `server.js`; nesse caso, a parte administrativa/API precisa rodar em outro serviço.


## Diagnóstico de implantação

O painel administrativo usa a API do mesmo servidor. Se `/admin.html` abrir, mas `POST /api/admin/login` retornar **404**, o domínio está servindo apenas os arquivos estáticos ou está passando por outro servidor/proxy que não executa este `server.js`.

O servidor incluído agora também atende:

- `/admin` → painel.
- `/health` → `{"ok":true,...}` para testar se a API correta está por trás do domínio.
- `/api/links` → links públicos.
- `/api/admin/login` → login do painel.

Para o domínio funcionar, o proxy/túnel precisa apontar para a porta em que `npm start` estiver rodando, e não para um servidor somente estático.
