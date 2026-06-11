// sw.js - Service Worker لمنظومة فرع المرقب
const CACHE_NAME = 'far-almorqb-v1';

// الملفات التي سيتم تخزينها مؤقتاً
const urlsToCache = [
  '/faisl8500-cmyk5/',
  '/faisl8500-cmyk5/index.html',
  '/faisl8500-cmyk5/manifest.json',
  '/faisl8500-cmyk5/logo.png'
];

// تثبيت الـ Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// استرجاع الملفات من الكاش أو الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// تنشيط الـ Service Worker وتنظيف الكاش القديم
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});