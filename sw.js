const CACHE_NAME = 'nutrisnap-v2.1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/js/app.js',
  '/js/db.js',
  '/js/foods.js',
  '/js/openfoodfacts.js',
  '/js/vision.js',
  '/js/camera.js',
  '/js/charts.js',
  '/js/insights.js',
  '/js/sync.js',
  '/js/ui.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// API domains that should never be cached
const API_DOMAINS = [
  'api.anthropic.com',
  'world.openfoodfacts.org',
  'supabase.co',
  'supabase.com',
  'cdn.jsdelivr.net'
];

// Install - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache API requests
  if (API_DOMAINS.some(domain => url.hostname.includes(domain))) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((fetchResponse) => {
          // Don't cache non-GET or external requests
          if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
            return fetchResponse;
          }
          // Cache new resources
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
      .catch(() => {
        // Offline fallback - return cached index for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});
