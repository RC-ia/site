(() => {
  const state = {
    query: '',
    category: 'all',
    sort: 'featured',
    cart: JSON.parse(localStorage.getItem('sitealeatorio-cart') || '{}'),
    pluginsReady: false,
    externalLinks: [],
  };

  const $ = (id) => document.getElementById(id);
  const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const uniqueCategories = () => [{ id: 'all', name: 'Todos', icon: 'ALL', pluginId: null }, ...SiteAleatorio.categories()];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Falha ao carregar plugin: ${src}`));
      document.head.appendChild(script);
    });
  }

  async function loadPlugins() {
    for (const src of window.SITE_ALEATORIO_PLUGIN_MANIFEST || []) {
      await loadScript(src);
    }
    state.pluginsReady = true;
    renderCategories();
    renderProducts();
    await loadExternalLinks();
  }

  async function loadExternalLinks() {
    try {
      const response = await fetch('./api/links', { cache: 'no-store' });
      if (!response.ok) throw new Error('API de links indisponível');
      state.externalLinks = await response.json();
    } catch {
      state.externalLinks = [];
    }
    renderExternalLinks();
  }

  function renderExternalLinks() {
    const section = $('external-links-section');
    const grid = $('external-links-grid');
    if (!section || !grid) return;
    if (!state.externalLinks.length) {
      section.hidden = true;
      return;
    }

    const filtered = state.externalLinks.filter(link => {
      const q = state.query.trim().toLocaleLowerCase('pt-BR');
      if (!q) return true;
      return `${link.name} ${link.source} ${link.category}`.toLocaleLowerCase('pt-BR').includes(q);
    });

    section.hidden = filtered.length === 0;
    grid.innerHTML = filtered.map(link => {
      const image = link.image
        ? `<img src="${escapeHtml(link.image)}" alt="" loading="lazy">`
        : `<span class="external-link__fallback">${escapeHtml((link.source || 'LINK').slice(0, 8))}</span>`;
      return `
        <article class="external-link-card">
          <div class="external-link__image">${image}</div>
          <div class="external-link__body">
            <div class="external-link__meta"><span>${escapeHtml(link.source || 'Loja')}</span><span>${escapeHtml(link.category || 'Diversos')}</span></div>
            <h3>${escapeHtml(link.name)}</h3>
            ${link.price ? `<strong class="external-link__price">${escapeHtml(link.price)}</strong>` : ''}
            <a class="add-button" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">Ver oferta ↗</a>
          </div>
        </article>
      `;
    }).join('');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }

  function filteredProducts() {
    const normalized = state.query.trim().toLocaleLowerCase('pt-BR');
    const items = SiteAleatorio.products().filter(product => {
      const matchesCategory = state.category === 'all' || product.category === state.category;
      const haystack = `${product.name} ${product.subtitle} ${product.meta}`.toLocaleLowerCase('pt-BR');
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });

    return items.sort((a, b) => {
      if (state.sort === 'price-asc') return a.price - b.price;
      if (state.sort === 'price-desc') return b.price - a.price;
      if (state.sort === 'name') return a.name.localeCompare(b.name, 'pt-BR');
      return 0;
    });
  }

  function categoryInfo(id) {
    return uniqueCategories().find(category => category.id === id) || uniqueCategories()[0];
  }

  function renderCategories() {
    const list = $('category-list');
    const categories = uniqueCategories();
    const counts = SiteAleatorio.products().reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    list.innerHTML = categories.map(category => `
      <button class="category ${category.id === state.category ? 'is-active' : ''}" data-category="${category.id}" type="button">
        <span class="category__icon">${category.icon}</span>
        <span>${category.name}</span>
        <b>${category.id === 'all' ? SiteAleatorio.products().length : (counts[category.id] || 0)}</b>
      </button>
    `).join('');

    list.querySelectorAll('[data-category]').forEach(button => {
      button.addEventListener('click', () => {
        state.category = button.dataset.category;
        renderCategories();
        renderProducts();
      });
    });
  }

  function productCard(product) {
    const inCart = state.cart[product.id] || 0;
    return `
      <article class="cm-product-card">
        <div class="cm-product-image">
          <img src="${escapeHtml(product.image || '')}" alt="${escapeHtml(product.name)}" loading="lazy">
          ${product.badge ? `<span class="cm-product-badge">${escapeHtml(product.badge)}</span>` : ''}
          <button class="cm-favorite" type="button" aria-label="Favoritar ${escapeHtml(product.name)}">♡</button>
        </div>
        <div class="cm-product-body">
          <span class="cm-product-category">${escapeHtml(categoryInfo(product.category).name)}</span>
          <h3>${escapeHtml(product.name)}</h3>
          <div class="cm-rating"><span>★★★★★</span> <small>(${Number(product.reviews || 0)})</small></div>
          <div class="cm-price">${money(product.price)}</div>
          <button class="cm-add" data-add="${escapeHtml(product.id)}" type="button">${inCart ? `+${inCart} no carrinho` : 'Adicionar ao carrinho'}</button>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const products = filteredProducts();
    $('product-grid').innerHTML = products.map(productCard).join('');
    $('empty-state').hidden = products.length !== 0;
    $('result-count').textContent = `${products.length} ${products.length === 1 ? 'item' : 'itens'}`;
    $('catalog-title').textContent = state.category === 'all' ? 'Todos os produtos' : categoryInfo(state.category).name;
    renderExternalLinks();

    document.querySelectorAll('[data-add]').forEach(button => {
      button.addEventListener('click', () => addToCart(button.dataset.add));
    });
  }

  function saveCart() {
    localStorage.setItem('sitealeatorio-cart', JSON.stringify(state.cart));
  }

  function addToCart(id) {
    state.cart[id] = (state.cart[id] || 0) + 1;
    saveCart();
    renderProducts();
    updateCartCount();
    showToast('Produto adicionado ao carrinho');
  }

  function removeFromCart(id) {
    delete state.cart[id];
    saveCart();
    renderProducts();
    renderCart();
  }

  function changeQuantity(id, delta) {
    state.cart[id] = (state.cart[id] || 0) + delta;
    if (state.cart[id] <= 0) delete state.cart[id];
    saveCart();
    renderProducts();
    renderCart();
  }

  function showToast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }

  $('search-form').addEventListener('submit', event => {
    event.preventDefault();
    state.query = $('search-input').value;
    state.category = 'all';
    renderCategories();
    renderProducts();
  });

  $('search-input').addEventListener('input', () => {
    state.query = $('search-input').value;
    renderProducts();
    renderExternalLinks();
  });

  $('sort-select').addEventListener('change', event => {
    state.sort = event.target.value;
    renderProducts();
  });

  $('clear-filters').addEventListener('click', () => {
    state.query = '';
    state.category = 'all';
    $('search-input').value = '';
    renderCategories();
    renderProducts();
  });

  $('empty-clear').addEventListener('click', () => $('clear-filters').click());
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('sitealeatorio-cart') || '{}');
    const count = Object.values(cart).reduce((sum, quantity) => sum + Number(quantity || 0), 0);
    const badge = $('cart-count');
    if (badge) badge.textContent = count;
  }

  updateCartCount();

  function renderCart() {
    updateCartCount();
  }

  const couponCopy = $('coupon-copy');
  if (couponCopy) couponCopy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('BEMVINDO'); showToast('Cupom BEMVINDO copiado'); }
    catch { showToast('Cupom: BEMVINDO'); }
  });

  loadPlugins().catch(error => {
    console.error(error);
    showToast('Um plugin não pôde ser carregado.');
  }).finally(() => {
    renderCart();
  });
})();