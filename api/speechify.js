// Proxy serveur Vercel : la clé Speechify reste exclusivement dans SPEECHIFY_API_KEY.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const apiKey = process.env.SPEECHIFY_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'Speechify non configuré dans Vercel (SPEECHIFY_API_KEY)' });

  const { path, method = 'GET', body } = req.body || {};
  if (typeof path !== 'string' || !/^\/v1\/(audio\/speech|voices)(\?.*)?$/.test(path)) {
    return res.status(400).json({ error: 'Route Speechify non autorisée' });
  }
  if (!['GET', 'POST'].includes(method)) return res.status(405).json({ error: 'Méthode Speechify non autorisée' });

  let payload;
  if (method === 'POST') {
    try { payload = typeof body === 'string' ? JSON.parse(body) : body; }
    catch { return res.status(400).json({ error: 'Corps de requête Speechify invalide' }); }
    if (!payload || typeof payload.input !== 'string' || !payload.input.trim()) {
      return res.status(400).json({ error: 'Le texte à synthétiser est obligatoire' });
    }
    if (payload.input.length > 2000) return res.status(413).json({ error: 'Le texte dépasse la limite de 2000 caractères' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40000);
  try {
    const upstream = await fetch(`https://api.speechify.ai${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(method === 'POST' ? { body: JSON.stringify(payload) } : {}),
      signal: controller.signal,
    });
    const content = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    const requestId = upstream.headers.get('speechify-request-id');
    if (requestId) res.setHeader('Speechify-Request-Id', requestId);
    return res.status(upstream.status).send(content);
  } catch (error) {
    const timedOut = error && error.name === 'AbortError';
    return res.status(502).json({ error: timedOut ? 'Délai dépassé en contactant Speechify' : 'Impossible de joindre Speechify' });
  } finally {
    clearTimeout(timeout);
  }
}
