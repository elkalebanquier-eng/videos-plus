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
    const send = async (requestBody) => fetch(`https://api.speechify.ai${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(method === 'POST' ? { body: JSON.stringify(requestBody) } : {}),
      signal: controller.signal,
    });
    let upstream = await send(payload);
    let content = Buffer.from(await upstream.arrayBuffer());
    let retryRequestId = '';

    // Speechify may occasionally return a successful but silent PCM payload.
    // Retry once as WAV server-side so already-open clients can recover too.
    if (method === 'POST' && /\/v1\/audio\/speech(?:\?|$)/.test(path)
      && upstream.ok && payload?.output_format === 'pcm_24000') {
      try {
        const data = JSON.parse(content.toString('utf8'));
        const layers = [data, data?.data, data?.result, data?.output].filter(x => x && typeof x === 'object');
        const audio = [...layers].reverse().map(x => x.audio_data || (typeof x.audio === 'string' ? x.audio : '') || x.audio?.audio_data || x.audio?.data).find(x => typeof x === 'string' && x.trim());
        if (audio) {
          let encoded = audio.replace(/^data:audio\/[^;,]+;base64,/i, '').replace(/^base64,/i, '').replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
          encoded += '='.repeat((4 - encoded.length % 4) % 4);
          const pcm = Buffer.from(encoded, 'base64');
          if (pcm.length >= 2048 && pcm.length % 2 === 0) {
            let peak = 0;
            for (let i = 0; i + 1 < pcm.length; i += 2) peak = Math.max(peak, Math.abs(pcm.readInt16LE(i)) / 32768);
            if (peak < 0.001) {
              retryRequestId = upstream.headers.get('speechify-request-id') || '';
              upstream = await send({ ...payload, output_format: undefined, audio_format: 'wav' });
              content = Buffer.from(await upstream.arrayBuffer());
            }
          }
        }
      } catch (retryError) {
        if (retryError?.name === 'AbortError') throw retryError;
        // Keep the original response on inspection/parsing errors; browser still validates audio.
      }
    }
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    const requestId = upstream.headers.get('speechify-request-id') || retryRequestId;
    if (requestId) res.setHeader('Speechify-Request-Id', requestId);
    return res.status(upstream.status).send(content);
  } catch (error) {
    const timedOut = error && error.name === 'AbortError';
    return res.status(502).json({ error: timedOut ? 'Délai dépassé en contactant Speechify' : 'Impossible de joindre Speechify' });
  } finally {
    clearTimeout(timeout);
  }
}
