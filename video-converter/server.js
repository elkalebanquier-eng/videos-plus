import express from 'express';
import multer from 'multer';
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const app = express();
const port = Number(process.env.PORT || 10000);
const maxBytes = 220 * 1024 * 1024;
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://videos-plus-elkalebanquier-engs-projects.vercel.app';
const upload = multer({ limits: { fileSize: maxBytes }, storage: multer.memoryStorage() });

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === allowedOrigin || origin === 'https://elka-jobnet.vercel.app') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/health', (_req, res) => res.json({ ok: true, service: 'videos-plus-converter', encoder: 'ffmpeg-h264-aac' }));

app.post('/convert', upload.single('video'), async (req, res) => {
  if (!req.file?.buffer?.length) return res.status(400).json({ error: 'Fichier vidéo manquant' });
  const id = crypto.randomUUID();
  const input = path.join(os.tmpdir(), `videos-plus-${id}.webm`);
  const output = path.join(os.tmpdir(), `videos-plus-${id}.mp4`);
  try {
    await fs.writeFile(input, req.file.buffer);
    const args = ['-y', '-i', input, '-map', '0:v:0', '-map', '0:a:0?', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '128k', '-ar', '48000', '-movflags', '+faststart', '-f', 'mp4', output];
    const result = await new Promise((resolve, reject) => {
      const child = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
      let stderr = '';
      child.stderr.on('data', chunk => { stderr += chunk.toString().slice(-4000); });
      child.on('error', reject);
      child.on('close', code => code === 0 ? resolve() : reject(new Error(stderr || `ffmpeg exit ${code}`)));
    });
    await fs.access(output);
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="videos-plus.mp4"');
    res.setHeader('Cache-Control', 'no-store');
    res.send(await fs.readFile(output));
  } catch (error) {
    console.error('conversion failed', error?.message || error);
    if (!res.headersSent) res.status(500).json({ error: 'Conversion MP4 impossible' });
  } finally {
    await Promise.allSettled([fs.unlink(input), fs.unlink(output)]);
  }
});

app.use((error, _req, res, _next) => {
  if (error?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Vidéo trop volumineuse (maximum 220 Mo)' });
  res.status(500).json({ error: 'Erreur du convertisseur' });
});

app.listen(port, '0.0.0.0', () => console.log(`Videos Plus converter listening on ${port}`));
