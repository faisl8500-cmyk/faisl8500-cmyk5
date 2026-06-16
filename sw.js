// sw.js - Service Worker لمنظومة فرع المرقب
const CACHE_NAME = 'far-almorqb-v2.1.2';

// الملفات الثابتة فقط (لا تتغير كثيراً)
const urlsToCache = [
  '/faisl8500-cmyk5/manifest.json',
  '/faisl8500-cmyk5/logo.png'
];

// تثبيت الـ Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing v2.1.2...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// استراتيجية Network First — يجلب دائماً من الشبكة أولاً
// وإذا فشل يرجع للكاش (للعمل بدون إنترنت)
self.addEventListener('fetch', event => {
  // تجاهل طلبات غير GET
  if (event.request.method !== 'GET') return;

  // تجاهل طلبات Firebase و Supabase و ImgBB (لا تُخزَّن)
  const url = event.request.url;
  if (
    url.includes('firebase') ||
    url.includes('supabase') ||
    url.includes('imgbb') ||
    url.includes('googleapis')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // حفظ نسخة جديدة في الكاش
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // إذا فشلت الشبكة، ارجع للكاش
        return caches.match(event.request);
      })
  );
});

// تنشيط الـ Service Worker وحذف الكاش القديم
self.addEventListener('activate', event => {
  console.log('[SW] Activating v2.1.2...');
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
