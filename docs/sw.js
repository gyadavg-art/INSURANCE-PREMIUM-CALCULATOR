/* ═══════════════════════════════════════════════════════
   SERVICE WORKER — NIA Motor Premium Calculator PWA
   Caches everything on first load → works 100% offline
═══════════════════════════════════════════════════════ */

const CACHE_NAME = 'nia-calc-v2';

// All files to cache on install
const PRECACHE = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './css/global.css',
  './css/health.css',
  './css/motor.css',
  './css/fire.css',
  './js/health.js',
  './js/motor.js',
  './js/nav.js',
  './js/fire.js',
  './js/pwa.js'
];

/* ── INSTALL: cache all files immediately ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())   // activate immediately
  );
});

/* ── ACTIVATE: remove old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── FETCH: serve from cache first, fallback to network ── */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        // Return cached version (offline works perfectly)
        if (cached) return cached;
        // Not in cache — try network (only if online)
        return fetch(event.request)
          .then(response => {
            // Cache any new successful responses
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
            }
            return response;
          })
          .catch(() => {
            // Network failed and not cached — show offline page for navigation
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});
