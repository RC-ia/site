# Site Aleatório Tech

Marketplace experimental de computação e tecnologia, construído como um site estático.

## O que tem

- Catálogo de hardware, periféricos, software e itens diversos.
- Busca instantânea.
- Filtros por categoria.
- Ordenação por preço e nome.
- Carrinho persistido em `localStorage`.
- Sistema de plugins para adicionar categorias e produtos sem alterar a página principal.
- Interface responsiva.

## Estrutura

```text
/
├── index.html
├── app.js
├── style.css
├── favicon.svg
└── plugins/
    ├── core.js
    ├── manifest.js
    ├── hardware.plugin.js
    ├── peripherals.plugin.js
    ├── software.plugin.js
    └── other.plugin.js
```

## Como criar um plugin

Um plugin registra seus dados no registry:

```js
SiteAleatorio.register({
  id: 'meu-plugin',
  name: 'Meu Plugin',
  version: '1.0.0',
  icon: '🧩',
  description: 'Descrição curta.',
  categories: [
    { id: 'categoria', name: 'Categoria', icon: '📦' }
  ],
  products: [
    {
      id: 'produto-01',
      category: 'categoria',
      name: 'Produto',
      subtitle: 'Descrição',
      price: 99.90,
      rating: 4.8,
      visual: 'CPU',
      meta: 'Especificação'
    }
  ]
});
```

Depois, adicione o caminho do arquivo em `plugins/manifest.js`.

## Execução

Não há build nem backend nesta versão. Basta abrir `index.html` ou publicar os arquivos em um host estático.