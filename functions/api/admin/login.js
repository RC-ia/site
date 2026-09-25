import { json, getPassword, issueToken, readRequestJson } from '../../_shared.js';

export async function onRequestPost(context) {
  try {
    const data = await readRequestJson(context.request);
    const password = String(data.password || '');
    const expected = await getPassword(context);

    if (password !== expected) {
      return json({ error: 'Senha incorreta.' }, 401);
    }

    return json({ token: await issueToken(context) });
  } catch (error) {
    return json({ error: error.message || 'Erro no login.' }, 500);
  }
}