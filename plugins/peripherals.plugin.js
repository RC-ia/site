SiteAleatorio.register({
  id: 'peripherals',
  name: 'Periféricos',
  version: '1.0.0',
  icon: '⌨️',
  description: 'Tudo que fica entre você e o computador.',
  categories: [
    { id: 'keyboard', name: 'Teclados', icon: '⌨️' },
    { id: 'mouse', name: 'Mouses', icon: '🖱️' },
    { id: 'monitor', name: 'Monitores', icon: '🖥️' },
    { id: 'audio', name: 'Áudio', icon: '🎧' },
  ],
  products: [
    { id: 'pp-key-01', category: 'keyboard', name: 'SwitchLab 75', subtitle: 'Mecânico · hot-swap · RGB', price: 329.90, oldPrice: 379.90, rating: 4.8, badge: 'OFERTA', visual: '⌨', meta: '75% · USB-C' },
    { id: 'pp-key-02', category: 'keyboard', name: 'RetroBoard 60', subtitle: 'Compacto · keycaps PBT · Bluetooth', price: 279.90, rating: 4.4, visual: '⌨', meta: '60% · BT' },
    { id: 'pp-mouse-01', category: 'mouse', name: 'Vector Air', subtitle: 'Sensor 26K · 58 g · wireless', price: 299.90, rating: 4.8, badge: 'TOP', visual: '◉', meta: '26K · 58 g' },
    { id: 'pp-mouse-02', category: 'mouse', name: 'Click 2D', subtitle: 'Ergonômico · 8 botões · USB', price: 119.90, rating: 4.5, visual: '◉', meta: '8 botões' },
    { id: 'pp-mon-01', category: 'monitor', name: 'Vision 27Q', subtitle: '27" · 1440p · 165 Hz · IPS', price: 1399.90, oldPrice: 1549.90, rating: 4.9, badge: 'OFERTA', visual: '27"', meta: 'QHD · 165 Hz' },
    { id: 'pp-mon-02', category: 'monitor', name: 'PixelWide 34', subtitle: '34" ultrawide · 144 Hz · HDR', price: 2199.90, rating: 4.7, visual: '34"', meta: 'UWQHD · 144 Hz' },
    { id: 'pp-aud-01', category: 'audio', name: 'Echo Studio', subtitle: 'Headset USB · microfone destacável', price: 399.90, rating: 4.8, visual: '🎧', meta: 'USB · 7.1' },
  ],
});