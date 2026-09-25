import { json, validToken, getLinks, saveLinks } from '../../_shared.js';

export async function onRequestDelete(context) {
  try {
    if (!(await validToken(context, context.request))) {
      return json({ error: 'Não autorizado.' }, 401);
    }

    const links = await getLinks(context);
    const next = links.filter(link => link.id !== context.params.id);
    if (next.length === links.length) {
      return json({ error: 'Link não encontrado.' }, 404);
    }

    await saveLinks(context, next);
    return json({ ok: true });
  } catch (error) {
    return json({ error: error.message || 'Erro ao excluir link.' }, 500);
  }
}