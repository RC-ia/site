SiteAleatorio.register({
  id: 'software',
  name: 'Software & Serviços',
  version: '1.0.0',
  icon: '💿',
  description: 'Licenças, ferramentas e serviços digitais.',
  categories: [
    { id: 'os', name: 'Sistemas', icon: '🪟' },
    { id: 'dev', name: 'Desenvolvimento', icon: '🧑‍💻' },
    { id: 'cloud', name: 'Cloud', icon: '☁️' },
  ],
  products: [
    { id: 'sw-os-01', category: 'os', name: 'OS Forge Desktop', subtitle: 'Licença digital · 1 dispositivo', price: 189.90, rating: 4.4, visual: 'OS', meta: 'Digital' },
    { id: 'sw-dev-01', category: 'dev', name: 'DevBox Pro', subtitle: 'IDE + ferramentas · licença anual', price: 299.90, rating: 4.6, visual: '</>', meta: '1 ano' },
    { id: 'sw-cloud-01', category: 'cloud', name: 'Pocket Cloud 1TB', subtitle: 'Armazenamento · sincronização · 1 ano', price: 129.90, badge: 'NEM PRECISA', rating: 4.5, visual: '☁', meta: '1 TB · 1 ano' },
  ],
});