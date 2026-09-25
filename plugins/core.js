(() => {
  const plugins = new Map();
  const events = new EventTarget();

  const api = {
    register(plugin) {
      if (!plugin || !plugin.id) return;
      plugins.set(plugin.id, {
        version: '1.0.0',
        products: [],
        categories: [],
        ...plugin,
      });
      events.dispatchEvent(new CustomEvent('plugin:registered', { detail: plugins.get(plugin.id) }));
    },
    all() { return [...plugins.values()]; },
    products() { return [...plugins.values()].flatMap(plugin => plugin.products || []); },
    categories() {
      return [...plugins.values()].flatMap(plugin => (plugin.categories || []).map(category => ({ ...category, pluginId: plugin.id })));
    },
    on(event, callback) { events.addEventListener(event, callback); },
    emit(event, detail) { events.dispatchEvent(new CustomEvent(event, { detail })); },
  };

  window.SiteAleatorio = api;
})();