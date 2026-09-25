import { json, validToken, setPassword, readRequestJson } from '../../_shared.js';

export async function onRequestPost(context) {
  try {
    if (!(await validToken(context, context.request))) {
      return json({ error: 'Não autorizado.' }, 401);
    }

    const data = await readRequestJson(context);
    const password = String(data.password || '');
    if (password.length < 4) {
      return json({ error: 'Use pelo menos 4 caracteres.' }, 400);
    }

    await setPassword(context, password);
    return json({ ok: true });
  } catch (error) {
    return json({ error: error.message || 'Erro ao trocar senha.' }, 500);
  }
}