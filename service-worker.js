// ═══════════════════════════════════════════════════════════
// KIKO👑 — SERVICE WORKER
// 1) Cache offline : shell de l'app + assets statiques + images/vidéos
//    déjà vues (Cloudinary, ImageKit, Firebase Storage).
// 2) Push web : importe le SDK Service Worker OneSignal pour recevoir
//    et afficher les notifications, dans le MÊME worker que le cache
//    (un seul SW enregistré sur ./  → pas de conflit de scope).
// ═══════════════════════════════════════════════════════════

importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

const CACHE_VERSION = 'kiko-cache-v1';

// Fichiers du "shell" de l'app — connus au build, mis en cache dès l'install.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './assets/clapperboard-clay.webp',
  './assets/mascotte-presentateur.webp',
  './pastel-theme.css'
];

// Domaines dont les médias (images/vidéos déjà vues) sont mis en cache
// pour un accès instantané + économie de données en 3G/connexion faible.
const MEDIA_HOSTS = [
  'res.cloudinary.com',
  'ik.imagekit.io',
  'firebasestorage.googleapis.com',
  'firebasestorage.app'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .catch(() => {}) // ne bloque jamais l'installation si un fichier manque
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // on ne touche jamais aux écritures (posts, messages…)

  const url = new URL(req.url);

  // ── Médias déjà vus (photos/vidéos) → cache d'abord, réseau en secours ──
  // Une fois qu'une vidéo/photo a été chargée une fois, elle reste
  // disponible hors-ligne et ne re-consomme plus de data.
  const isMedia = /\.(jpe?g|png|webp|gif|mp4|webm|m3u8|mp3)(\?.*)?$/i.test(url.pathname)
    || MEDIA_HOSTS.some(h => url.hostname.includes(h));
  if (isMedia) {
    event.respondWith(
      caches.match(req).then(cached => {
        const fetchPromise = fetch(req).then(res => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(req, clone));
          }
          return res;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // ── Shell de l'app (même origine) → réseau d'abord pour rester à jour,
  //    cache en secours si hors-ligne ──
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))
    );
  }
  // Les autres requêtes (Firebase Realtime DB, Auth, API tierces) passent
  // directement au réseau — pas de mise en cache, elles sont temps-réel.
});
