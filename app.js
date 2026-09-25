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
  const uniqueCategories = () => [{ id: 'all', name: 'Todos', icon: '✦', pluginId: null }, ...SiteAleatorio.categories()];

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
    renderPluginUI();
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
    const visualClass = product.visual.length > 3 ? 'product-card__visual--word' : '';
    return `
      <article class="product-card">
        <div class="product-card__visual ${visualClass}" data-visual="${product.visual.charAt(0)}">
          ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ''}
          <span class="product-card__visual-text">${product.visual}</span>
          <button class="favorite" type="button" aria-label="Favoritar ${product.name}">♡</button>
        </div>
        <div class="product-card__body">
          <div class="product-card__meta"><span>${categoryInfo(product.category).name}</span><span>★ ${product.rating.toFixed(1)}</span></div>
          <h3>${product.name}</h3>
          <p>${product.subtitle}</p>
          <div class="product-card__spec">${product.meta}</div>
          <div class="product-card__buy">
            <div>
              ${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ''}
              <strong>${money(product.price)}</strong>
            </div>
            <button class="add-button" data-add="${product.id}" type="button">${inCart ? `+${inCart}` : '+'} Adicionar</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const products = filteredProducts();
    $('product-grid').innerHTML = products.map(productCard).join('');
    $('empty-state').hidden = products.length !== 0 || state.externalLinks.length !== 0;
    $('result-count').textContent = `${products.length} ${products.length === 1 ? 'item' : 'itens'}`;
    $('catalog-title').textContent = state.category === 'all' ? 'Todos os produtos' : categoryInfo(state.category).name;
    renderExternalLinks();

    document.querySelectorAll('[data-add]').forEach(button => {
      button.addEventListener('click', () => addToCart(button.dataset.add));
    });
  }

  function renderPluginUI() {
    const plugins = SiteAleatorio.all();
    const pluginCount = $('plugin-count');
    if (pluginCount) pluginCount.textContent = plugins.length;
    $('plugin-strip').innerHTML = plugins.map(plugin => `
      <button class="plugin-pill" data-plugin-category="${plugin.id}" type="button">
        ${plugin.icon} ${plugin.name}
      </button>
    `).join('');
    $('plugin-list').innerHTML = plugins.map(plugin => `
      <div class="plugin-row">
        <span class="plugin-row__icon">${plugin.icon}</span>
        <div><strong>${plugin.name}</strong><p>${plugin.description}</p></div>
        <span class="plugin-row__version">v${plugin.version}</span>
      </div>
    `).join('');

    document.querySelectorAll('[data-plugin-category]').forEach(button => {
      button.addEventListener('click', () => {
        const plugin = SiteAleatorio.all().find(item => item.id === button.dataset.pluginCategory);
        state.category = plugin?.categories?.[0]?.id || 'all';
        renderCategories();
        renderProducts();
        window.scrollTo({ top: $('catalog-section').offsetTop - 20, behavior: 'smooth' });
      });
    });
  }

  function saveCart() {
    localStorage.setItem('sitealeatorio-cart', JSON.stringify(state.cart));
  }

  function addToCart(id) {
    state.cart[id] = (state.cart[id] || 0) + 1;
    saveCart();
    renderProducts();
    renderCart();
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

  function renderCart() {
    const products = SiteAleatorio.products();
    const entries = Object.entries(state.cart)
      .map(([id, quantity]) => ({ product: products.find(p => p.id === id), quantity }))
      .filter(entry => entry.product);
    const count = entries.reduce((sum, entry) => sum + entry.quantity, 0);
    const total = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
    $('cart-count').textContent = count;
    $('cart-total').textContent = money(total);

    $('cart-items').innerHTML = entries.length ? entries.map(({ product, quantity }) => `
      <div class="cart-item">
        <div class="cart-item__visual">${product.visual}</div>
        <div class="cart-item__info"><strong>${product.name}</strong><span>${money(product.price)}</span></div>
        <div class="cart-item__controls">
          <button data-cart-minus="${product.id}" type="button">−</button>
          <span>${quantity}</span>
          <button data-cart-plus="${product.id}" type="button">+</button>
          <button class="cart-item__remove" data-cart-remove="${product.id}" type="button">×</button>
        </div>
      </div>
    `).join('') : '<div class="cart-empty">🛒<strong>Seu carrinho está vazio.</strong><span>Adicione alguma coisa estranhamente tecnológica.</span></div>';

    document.querySelectorAll('[data-cart-minus]').forEach(button => button.addEventListener('click', () => changeQuantity(button.dataset.cartMinus, -1)));
    document.querySelectorAll('[data-cart-plus]').forEach(button => button.addEventListener('click', () => changeQuantity(button.dataset.cartPlus, 1)));
    document.querySelectorAll('[data-cart-remove]').forEach(button => button.addEventListener('click', () => removeFromCart(button.dataset.cartRemove)));
  }

  function showCart(open = true) {
    $('cart-drawer').classList.toggle('is-open', open);
    $('drawer-backdrop').classList.toggle('is-visible', open);
    $('cart-drawer').setAttribute('aria-hidden', String(!open));
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
  $('cart-button').addEventListener('click', () => showCart(true));
  $('close-cart').addEventListener('click', () => showCart(false));
  $('drawer-backdrop').addEventListener('click', () => showCart(false));
  $('checkout-button').addEventListener('click', () => showToast('Checkout demonstrativo — nada foi enviado.'));
  const pluginButton = $('plugin-button');
  if (pluginButton) pluginButton.addEventListener('click', () => $('plugin-dialog').showModal());
  const closePluginDialog = $('close-plugin-dialog');
  if (closePluginDialog) closePluginDialog.addEventListener('click', () => $('plugin-dialog').close());

  loadPlugins().catch(error => {
    console.error(error);
    showToast('Um plugin não pôde ser carregado.');
  }).finally(() => {
    renderCart();
  });
})();