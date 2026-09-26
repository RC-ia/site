SiteAleatorio.register({
  id: 'storefront',
  name: 'CentralMarket',
  version: '1.0.0',
  icon: 'CM',
  description: 'Catálogo principal da CentralMarket.',
  categories: [
    { id: 'electronics', name: 'Eletrônicos', icon: '▣' },
    { id: 'games', name: 'Games', icon: '⌁' },
    { id: 'fashion', name: 'Moda', icon: '◇' },
    { id: 'home', name: 'Casa e Decoração', icon: '⌂' },
    { id: 'beauty', name: 'Beleza e Cuidados', icon: '✦' },
    { id: 'sports', name: 'Esportes', icon: '◉' },
    { id: 'books', name: 'Livros', icon: '▤' },
    { id: 'pet', name: 'Pet', icon: '♡' },
    { id: 'gifts', name: 'Presentes', icon: '♢' },
    { id: 'more', name: 'Mais', icon: '•••' }
  ],
  products: [
    { id:'iphone-15', category:'electronics', name:'iPhone 15 128GB', subtitle:'Tela Super Retina e câmera avançada.', meta:'128 GB · 5G', visual:'iPhone', image:'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=85', rating:4.9, reviews:324, price:4299, oldPrice:4799, badge:'OFERTA' },
    { id:'jbl-headphones', category:'electronics', name:'Fone de Ouvido JBL', subtitle:'Som potente para acompanhar seu dia.', meta:'Bluetooth · ANC', visual:'JBL', image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85', rating:4.8, reviews:187, price:349.90, oldPrice:429.90, badge:'-18%' },
    { id:'nike-air-force', category:'fashion', name:'Tênis Nike Air Force 1', subtitle:'Clássico urbano com conforto diário.', meta:'Original · Casual', visual:'Nike', image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85', rating:4.9, reviews:521, price:799.90, oldPrice:899.90 },
    { id:'xiaomi-watch', category:'electronics', name:'Smartwatch Xiaomi', subtitle:'Monitore sua rotina com praticidade.', meta:'AMOLED · GPS', visual:'Xiaomi', image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85', rating:4.7, reviews:219, price:599.90, oldPrice:699.90 },
    { id:'air-fryer', category:'home', name:'Fritadeira Elétrica', subtitle:'Praticidade para preparar suas receitas.', meta:'5 L · Digital', visual:'Air Fryer', image:'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=85', rating:4.8, reviews:143, price:389.90, oldPrice:459.90 },
    { id:'executive-backpack', category:'fashion', name:'Mochila Executiva', subtitle:'Organização e estilo para sua rotina.', meta:'Notebook · 15.6”', visual:'Bag', image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85', rating:4.8, reviews:98, price:229.90, oldPrice:279.90 }
  ]
});