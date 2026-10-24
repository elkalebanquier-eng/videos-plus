import express from 'express';
import multer from 'multer';
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright-core';

const app = express();
const port = Number(process.env.PORT || 10000);
const maxBytes = 220 * 1024 * 1024;
const maxRenderSeconds = Number(process.env.MAX_RENDER_SECONDS || 45);
const publicAppUrl = process.env.PUBLIC_APP_URL || 'https://elka-jobnet.vercel.app';
const allowedOrigins = new Set([process.env.ALLOWED_ORIGIN || publicAppUrl, 'https://elka-jobnet.vercel.app']);
const upload = multer({ limits: { fileSize: maxBytes }, storage: multer.memoryStorage() });
const jobs = new Map();
let activeRender = false;

function publicBase(req) {
  const protocol = String(req.headers['x-forwarded-proto'] || req.protocol).split(',')[0];
  return `${protocol}://${req.get('host')}`;
}

async function findChromium() {
  const candidates = [process.env.CHROMIUM_PATH, '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(Boolean);
  for (const candidate of candidates) {
    try { await fs.access(candidate); return candidate; } catch (_) {}
  }
  throw new Error('Chromium introuvable dans le conteneur Render');
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: '4mb' }));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'videos-plus-renderer', encoder: 'ffmpeg-h264-aac', serverCanvas: true, planMode: 'free-safe', maxRenderSeconds, activeRender }));
function isAllowedOrigin(req) { return allowedOrigins.has(req.get('origin') || ''); }

function projectDuration(project) { return (project.scenes || []).reduce((total, scene) => total + Number(scene.duration || 0), 0); }
function validateProject(project) {
  if (!project || !Array.isArray(project.scenes) || project.scenes.length === 0) return 'Projet sans scène';
  if (project.scenes.length > 16) return 'Maximum 16 scènes sur le plan gratuit';
  const duration = projectDuration(project);
  if (!Number.isFinite(duration) || duration <= 0) return 'Durée de vidéo invalide';
  if (duration > maxRenderSeconds) return `Durée maximale sur le plan gratuit : ${maxRenderSeconds} secondes`;
  return null;
}
function freeRenderProject(project) {
  return JSON.parse(JSON.stringify({ ...project, format: ['9:16', '1:1', '16:9'].includes(project.format) ? project.format : '9:16', renderProfile: 'render-free-720p', quality: '720', scenes: project.scenes.map((scene, index) => ({ ...scene, index })) }));
}

app.post('/render', (req, res) => {
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: 'Origine non autorisée' });
  const error = validateProject(req.body);
  if (error) return res.status(400).json({ error });
  if (activeRender) return res.status(429).json({ error: 'Un rendu est déjà en cours sur le moteur gratuit Render', retryAfterSeconds: 10 });
  const id = `render_${crypto.randomUUID()}`;
  const job = { id, project: freeRenderProject(req.body), status: 'queued', stage: 'queued', progress: 0, createdAt: new Date().toISOString(), output: null, error: null };
  jobs.set(id, job);
  activeRender = true;
  runRenderJob(job, publicBase(req)).catch(error => { job.status = 'failed'; job.stage = 'failed'; job.error = error?.message || 'Rendu Render impossible'; activeRender = false; });
  res.status(202).json({ jobId: id, status: job.status, maxRenderSeconds });
});

app.get('/render/:id', (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Rendu introuvable' });
  const data = { jobId: job.id, status: job.status, stage: job.stage, progress: job.progress, createdAt: job.createdAt };
  if (job.status === 'completed') { data.downloadUrl = `${publicBase(req)}/render/${job.id}/download`; data.mimeType = 'video/mp4'; }
  if (job.status === 'failed') data.error = job.error;
  res.json(data);
});

app.post('/render/:id/result', express.raw({ type: '*/*', limit: '220mb' }), async (req, res) => {
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: 'Origine non autorisée' });
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Rendu introuvable' });
  if (job.status !== 'rendering') return res.status(409).json({ error: 'Rendu non prêt à recevoir son résultat' });
  if (!req.body?.length) return res.status(400).json({ error: 'Résultat vidéo vide' });
  try {
    const output = path.join(os.tmpdir(), `videos-plus-render-${job.id}.mp4`);
    const input = path.join(os.tmpdir(), `videos-plus-render-${job.id}.input`);
    const isMp4 = req.body.length > 12 && req.body.subarray(4, 8).toString() === 'ftyp';
    if (isMp4) {
      await fs.writeFile(output, req.body);
    } else {
      job.stage = 'finalizing-mp4'; job.progress = 0.92;
      await fs.writeFile(input, req.body);
      await new Promise((resolve, reject) => {
        const args = ['-y', '-i', input, '-map', '0:v:0', '-map', '0:a:0?', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', output];
        const child = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
        let stderr = '';
        child.stderr.on('data', chunk => { stderr = (stderr + chunk.toString()).slice(-4000); });
        child.on('error', reject);
        child.on('close', code => code === 0 ? resolve() : reject(new Error(stderr || `ffmpeg exit ${code}`)));
      });
      await fs.unlink(input).catch(() => {});
    }
    await fs.access(output);
    job.output = output; job.status = 'completed'; job.stage = 'completed'; job.progress = 1;
    res.json({ ok: true });
  } catch (error) {
    await fs.unlink(path.join(os.tmpdir(), `videos-plus-render-${job.id}.input`)).catch(() => {});
    await fs.unlink(path.join(os.tmpdir(), `videos-plus-render-${job.id}.mp4`)).catch(() => {});
    job.status = 'failed'; job.stage = 'failed'; job.error = error?.message || 'Impossible de stocker le MP4';
    res.status(500).json({ error: job.error });
  }
});

app.get('/render/:id/download', async (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job || job.status !== 'completed' || !job.output) return res.status(404).json({ error: 'MP4 non disponible' });
  try { await fs.access(job.output); res.download(job.output, 'videos-plus.mp4', { headers: { 'Cache-Control': 'no-store' } }); }
  catch { res.status(404).json({ error: 'MP4 expiré, relancez le rendu' }); }
});

async function runRenderJob(job, baseUrl) {
  let browser;
  job.status = 'rendering'; job.stage = 'starting-chromium';
  try {
    browser = await chromium.launch({ headless: true, executablePath: await findChromium(), args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process'] });
    const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1 });
    page.on('console', message => { if (message.type() === 'error') console.error('[renderer]', message.text()); });
    const pageErrors = [];
    page.on('pageerror', error => { pageErrors.push(error.message); console.error('[renderer pageerror]', error.message); });
    const callback = `${baseUrl}/render/${job.id}/result`;
    const renderUrl = new URL('/index.html', publicAppUrl);
    renderUrl.searchParams.set('serverRender', '1');
    renderUrl.searchParams.set('serverCallback', callback);
    job.stage = 'loading-renderer';
    await page.goto(renderUrl.toString(), { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.evaluate(project => { localStorage.setItem('vse_projects', JSON.stringify([project])); localStorage.setItem('vs_settings', JSON.stringify({ quality: '720' })); }, job.project);
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForFunction(() => typeof window.loadProject === 'function' && typeof window.exportVideo === 'function', null, { timeout: 60000 });
    await page.evaluate(id => window.loadProject(id), job.project.id);
    await page.waitForTimeout(700);
    job.stage = 'rendering-canvas'; job.progress = 0.1;
    const exportPromise = page.evaluate(() => window.exportVideo());
    const deadline = Date.now() + 180000;
    while (job.status === 'rendering' && Date.now() < deadline) {
      const event = await Promise.race([exportPromise.then(() => 'export-finished'), new Promise(resolve => setTimeout(() => resolve('wait'), 500))]);
      if (event === 'export-finished' && job.status !== 'completed') {
        const diagnostic = await page.evaluate(() => {
          const params = new URLSearchParams(location.search), callback = params.get('serverCallback');
          return { serverRender: params.get('serverRender') === '1', callbackHost: callback ? new URL(callback).host : null, toast: [...document.querySelectorAll('.toast.show')].map(node => node.textContent.trim()).filter(Boolean).slice(-3) };
        }).catch(() => ({}));
        throw new Error('Le rendu navigateur a fini sans transmettre le MP4; diagnostic=' + JSON.stringify({ ...diagnostic, pageErrors: pageErrors.slice(-3) }));
      }
      if (job.stage === 'rendering-canvas') job.progress = Math.min(0.85, job.progress + 0.01);
    }
    if (job.status !== 'completed') throw new Error('Délai dépassé pendant le rendu gratuit Render');
    await exportPromise;
  } finally {
    if (browser) await browser.close().catch(() => {});
    activeRender = false;
    setTimeout(() => cleanupJob(job.id), 15 * 60 * 1000).unref();
  }
}
async function cleanupJob(id) {
  const job = jobs.get(id); if (!job) return;
  if (job.output) await fs.unlink(job.output).catch(() => {});
  jobs.delete(id);
}

app.post('/convert', upload.single('video'), async (req, res) => {
  if (!req.file?.buffer?.length) return res.status(400).json({ error: 'Fichier vidéo manquant' });
  const id = crypto.randomUUID();
  const input = path.join(os.tmpdir(), `videos-plus-${id}.webm`), output = path.join(os.tmpdir(), `videos-plus-${id}.mp4`);
  try {
    await fs.writeFile(input, req.file.buffer);
    const args = ['-y', '-i', input, '-map', '0:v:0', '-map', '0:a:0?', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '128k', '-ar', '48000', '-movflags', '+faststart', '-f', 'mp4', output];
    await new Promise((resolve, reject) => { const child = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] }); let stderr = ''; child.stderr.on('data', chunk => { stderr += chunk.toString().slice(-4000); }); child.on('error', reject); child.on('close', code => code === 0 ? resolve() : reject(new Error(stderr || `ffmpeg exit ${code}`))); });
    await fs.access(output); res.setHeader('Content-Type', 'video/mp4'); res.setHeader('Content-Disposition', 'attachment; filename="videos-plus.mp4"'); res.setHeader('Cache-Control', 'no-store'); res.send(await fs.readFile(output));
  } catch (error) { console.error('conversion failed', error?.message || error); if (!res.headersSent) res.status(500).json({ error: 'Conversion MP4 impossible' }); }
  finally { await Promise.allSettled([fs.unlink(input), fs.unlink(output)]); }
});

app.use((error, _req, res, _next) => { if (error?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Vidéo trop volumineuse (maximum 220 Mo)' }); res.status(500).json({ error: 'Erreur du convertisseur' }); });
app.listen(port, '0.0.0.0', () => console.log(`Videos Plus Render renderer listening on ${port}`));
