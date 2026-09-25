SiteAleatorio.register({
  id: 'hardware',
  name: 'Hardware',
  version: '1.0.0',
  icon: '🧠',
  description: 'Componentes para montar e atualizar computadores.',
  categories: [
    { id: 'cpu', name: 'Processadores', icon: '🧠' },
    { id: 'gpu', name: 'Placas de vídeo', icon: '🎮' },
    { id: 'memory', name: 'Memória RAM', icon: '🧬' },
    { id: 'storage', name: 'Armazenamento', icon: '💾' },
  ],
  products: [
    { id: 'hw-cpu-01', category: 'cpu', name: 'Nebula Core 8', subtitle: '8 núcleos · 16 threads · 4.8 GHz', price: 799.90, oldPrice: 899.90, rating: 4.8, badge: 'OFERTA', visual: 'CPU', meta: 'AM5 · 65W' },
    { id: 'hw-cpu-02', category: 'cpu', name: 'Astra Mini 6', subtitle: '6 núcleos · 12 threads · 4.4 GHz', price: 529.90, rating: 4.6, visual: 'CPU', meta: 'AM4 · 65W' },
    { id: 'hw-gpu-01', category: 'gpu', name: 'Photon X 12GB', subtitle: '12 GB GDDR6 · PCIe 4.0 · 2.5 slots', price: 2499.90, oldPrice: 2799.90, rating: 4.9, badge: 'TOP', visual: 'GPU', meta: '12 GB · PCIe 4.0' },
    { id: 'hw-gpu-02', category: 'gpu', name: 'Arcade 8GB', subtitle: '8 GB GDDR6 · AV1 · baixo consumo', price: 1599.90, rating: 4.5, visual: 'GPU', meta: '8 GB · AV1' },
    { id: 'hw-ram-01', category: 'memory', name: 'Flux DDR4 16GB', subtitle: '1×16 GB · 3200 MHz · CL16', price: 249.90, rating: 4.8, visual: 'RAM', meta: '16 GB · DDR4' },
    { id: 'hw-ram-02', category: 'memory', name: 'Flux DDR5 32GB', subtitle: '2×16 GB · 6000 MHz · CL36', price: 549.90, badge: 'NOVO', rating: 4.7, visual: 'RAM', meta: '32 GB · DDR5' },
    { id: 'hw-ssd-01', category: 'storage', name: 'FlashDrive NVMe 1TB', subtitle: 'PCIe 4.0 · leitura de até 7.000 MB/s', price: 449.90, oldPrice: 499.90, rating: 4.9, badge: 'OFERTA', visual: 'SSD', meta: '1 TB · NVMe' },
    { id: 'hw-ssd-02', category: 'storage', name: 'Archive SSD 2TB', subtitle: 'SATA · leitura de até 550 MB/s', price: 699.90, rating: 4.6, visual: 'SSD', meta: '2 TB · SATA' },
  ],
});