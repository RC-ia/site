import { json, validToken, getLinks, saveLinks, readRequestJson } from '../_shared.js';

export async function onRequestGet(context) {
  try {
    return json(await getLinks(context));
  } catch (error) {
    return json({ error: error.message || 'Erro ao carregar links.' }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    if (!(await validToken(context, context.request))) {
      return json({ error: 'Não autorizado.' }, 401);
    }

    const data = await readRequestJson(context);
    if (!data.name || !data.url) {
      return json({ error: 'Nome e URL são obrigatórios.' }, 400);
    }

    let parsed;
    try { parsed = new URL(data.url); }
    catch { return json({ error: 'URL inválida.' }, 400); }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return json({ error: 'Use uma URL http ou https.' }, 400);
    }

    const link = {
      id: crypto.randomUUID(),
      name: String(data.name).slice(0, 120),
      url: parsed.toString(),
      source: String(data.source || 'Loja').slice(0, 60),
      category: String(data.category || 'Diversos').slice(0, 60),
      price: data.price ? String(data.price).slice(0, 30) : '',
      image: data.image ? String(data.image).slice(0, 500) : '',
      createdAt: new Date().toISOString(),
    };

    const links = await getLinks(context);
    links.unshift(link);
    await saveLinks(context, links);
    return json(link, 201);
  } catch (error) {
    return json({ error: error.message || 'Erro ao salvar link.' }, 500);
  }
}