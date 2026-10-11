const RENDER_URL = process.env.RENDER_RENDER_URL || 'https://videos-plus-converter-live.onrender.com/render';
const UPSTREAM_TIMEOUT_MS = 12000;

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).send(JSON.stringify(body));
}

export default async function handler(req, res) {
  const jobId = typeof req.query?.jobId === 'string' ? req.query.jobId : '';
  const download = req.query?.download === '1';
  if (download) {
    if (!/^render_[a-f0-9-]+$/.test(jobId)) return json(res, 400, { error: 'Identifiant de rendu invalide' });
    res.setHeader('Cache-Control', 'no-store');
    return res.redirect(307, `${RENDER_URL}/${encodeURIComponent(jobId)}/download`);
  }
  if (req.method !== 'POST' && req.method !== 'GET') return json(res, 405, { error: 'Méthode non autorisée' });
  if (req.method === 'GET' && !/^render_[a-f0-9-]+$/.test(jobId)) return json(res, 400, { error: 'Identifiant de rendu manquant' });

  const target = req.method === 'POST' ? RENDER_URL : `${RENDER_URL}/${encodeURIComponent(jobId)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: req.method === 'POST' ? { 'Content-Type': 'application/json', Accept: 'application/json' } : { Accept: 'application/json' },
      ...(req.method === 'POST' ? { body: JSON.stringify(req.body || {}) } : {}),
      signal: controller.signal,
    });
    const payload = await upstream.arrayBuffer();
    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    return res.send(Buffer.from(payload));
  } catch (error) {
    return json(res, 503, { error: 'Le moteur Render démarre ou est temporairement indisponible', retryable: true });
  } finally {
    clearTimeout(timer);
  }
}
