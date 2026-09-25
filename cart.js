(() => {
  const $ = (id) => document.getElementById(id);
  const money = (value) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

  const state = {
    cart: JSON.parse(localStorage.getItem('sitealeatorio-cart') || '{}')
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Falha ao carregar: ${src}`));
      document.head.appendChild(script);
    });
  }

  async function loadPlugins() {
    for (const src of window.SITE_ALEATORIO_PLUGIN_MANIFEST || []) {
      await loadScript(src);
    }
    render();
  }

  function saveCart() {
    localStorage.setItem('sitealeatorio-cart', JSON.stringify(state.cart));
  }

  function entries() {
    return Object.entries(state.cart)
      .map(([id, quantity]) => ({
        product: SiteAleatorio.products().find(product => product.id === id),
        quantity: Number(quantity)
      }))
      .filter(entry => entry.product && entry.quantity > 0);
  }

  function changeQuantity(id, delta) {
    const next = Number(state.cart[id] || 0) + delta;
    if (next > 0) state.cart[id] = next;
    else delete state.cart[id];
    saveCart();
    render();
  }

  function removeProduct(id) {
    delete state.cart[id];
    saveCart();
    render();
    toast('Produto removido');
  }

  function render() {
    const items = entries();
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    $('cart-summary').textContent = `${count} ${count === 1 ? 'item selecionado' : 'itens selecionados'}`;
    $('summary-items').textContent = count;
    $('summary-total').textContent = money(total);
    $('summary-grand-total').textContent = money(total);
    $('clear-cart').disabled = items.length === 0;
    $('checkout-button').disabled = items.length === 0;

    $('cart-list').innerHTML = items.map(({ product, quantity }) => `
      <article class="cart-page-item">
        <div class="cart-page-item__visual">${escapeHtml(product.visual)}</div>
        <div class="cart-page-item__main">
          <div class="cart-page-item__meta">
            <span>${escapeHtml(product.category)}</span>
            <button class="cart-page-item__remove" data-remove="${product.id}" type="button">Remover</button>
          </div>
          <h2>${escapeHtml(product.name)}</h2>
          <p>${escapeHtml(product.subtitle)}</p>
          <div class="cart-page-item__bottom">
            <strong>${money(product.price)}</strong>
            <div class="quantity-control">
              <button data-minus="${product.id}" type="button">−</button>
              <span>${quantity}</span>
              <button data-plus="${product.id}" type="button">+</button>
            </div>
          </div>
        </div>
      </article>
    `).join('');

    $('cart-empty').hidden = items.length > 0;

    document.querySelectorAll('[data-minus]').forEach(button => {
      button.addEventListener('click', () => changeQuantity(button.dataset.minus, -1));
    });
    document.querySelectorAll('[data-plus]').forEach(button => {
      button.addEventListener('click', () => changeQuantity(button.dataset.plus, 1));
    });
    document.querySelectorAll('[data-remove]').forEach(button => {
      button.addEventListener('click', () => removeProduct(button.dataset.remove));
    });
  }

  function clearCart() {
    state.cart = {};
    saveCart();
    render();
    toast('Carrinho limpo');
  }

  function toast(message) {
    const element = $('cart-toast');
    element.textContent = message;
    element.classList.add('is-visible');
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(() => element.classList.remove('is-visible'), 1800);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char]));
  }

  $('clear-cart').addEventListener('click', clearCart);
  $('checkout-button').addEventListener('click', () => toast('Checkout demonstrativo — nenhum pagamento foi enviado.'));

  loadPlugins().catch(error => {
    console.error(error);
    render();
  });
})();