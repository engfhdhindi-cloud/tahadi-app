// ===== Service Worker — تحدي الفهد =====
const CACHE_NAME = 'tahadi-v10';
const STATIC = [
  './manifest.json',
  './splash-bg.png',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'
];

// ===== تثبيت SW =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(STATIC.map(url => cache.add(url).catch(() => {})))
    )
  );
  // تفعيل فوري بدون انتظار
  self.skipWaiting();
});

// ===== تفعيل SW =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ===== اعتراض الطلبات =====
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API — لا نخزّن أبداً
  if (url.hostname === 'api.anthropic.com') {
    event.respondWith(fetch(event.request));
    return;
  }

  // index.html + ملفات اللعبة — Network First دائماً (أحدث نسخة)
  if (
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('index.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.mp3')
  ) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // بقية الملفات — Cache First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
