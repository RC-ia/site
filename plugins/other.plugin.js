SiteAleatorio.register({
  id: 'other',
  name: 'Diversos',
  version: '1.0.0',
  icon: '🎲',
  description: 'A categoria que justifica o nome Site Aleatório.',
  categories: [
    { id: 'network', name: 'Rede', icon: '📡' },
    { id: 'cables', name: 'Cabos & Adaptadores', icon: '🔌' },
    { id: 'desk', name: 'Setup', icon: '🪑' },
  ],
  products: [
    { id: 'ot-net-01', category: 'network', name: 'Router Lab Wi-Fi 6', subtitle: 'AX3000 · 4 antenas · mesh', price: 449.90, rating: 4.6, visual: '📡', meta: 'AX3000' },
    { id: 'ot-cab-01', category: 'cables', name: 'CableBox USB-C', subtitle: 'Dock 8-em-1 · HDMI · USB · PD', price: 219.90, oldPrice: 249.90, rating: 4.7, badge: 'OFERTA', visual: 'USB', meta: '8 em 1' },
    { id: 'ot-desk-01', category: 'desk', name: 'DeskPad 900', subtitle: '900×400 mm · superfície híbrida', price: 99.90, rating: 4.8, visual: 'PAD', meta: '900×400' },
  ],
});