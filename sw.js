const CACHE_NAME = 'far-almorqb-v2.1.1';
const urlsToCache = [
  '/faisl8500-cmyk5/',
  '/faisl8500-cmyk5/index.html',
  '/faisl8500-cmyk5/manifest.json',
  '/faisl8500-cmyk5/logo.png',
  '/faisl8500-cmyk5/icon-192.png',
  '/faisl8500-cmyk5/icon-512.png'
];

// تثبيت Service Worker وتخزين الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// استراتيجية: محاولة الشبكة أولاً، ثم العودة إلى Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// تنظيف التخزين المؤقت القديم عند تنشيط Service Worker جديد
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});