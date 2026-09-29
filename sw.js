/* Service worker БЦ «Раменки».
   Версия меняется при каждой публикации (VERSION) — браузер видит новый sw.js,
   ставит его сразу (skipWaiting), удаляет старые кэши и берёт страницы под контроль.
   Стратегия:
   • страницы (index.html) — сначала сеть, кэш только если нет связи → новая версия видна сразу;
   • иконки и манифест — из кэша с фоновым обновлением;
   • всё с других доменов (шрифты, CDN-библиотеки, ИИ) — не трогаем. */
const VERSION = '2026.09.29-1';
const CACHE = 'bc-ramenki-' + VERSION;
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/logo-mark-white.png',
  './assets/icons/favicon-32x32.png',
  './assets/icons/favicon-16x16.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isPage = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (isPage) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(res => {
          if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); }
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
