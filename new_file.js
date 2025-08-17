// 缓存版本（更新时改名字，如v2，强制浏览器重新缓存）
const CACHE_NAME = 'photo-tool-v1';

// 需要缓存的资源（和index.html里引入的CDN/文件一致！）
const urlsToCache = [
  '.', // 当前页面
  'index.html',
  'https://cdn.tailwindcss.com', // Tailwind CSS
  'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css', // Font Awesome
  'https://html2canvas.hertzen.com/dist/html2canvas.min.js' // html2canvas
];

// 【安装阶段】缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // 强制激活新Service Worker
  );
});

// 【激活阶段】清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// 【拦截请求】优先从缓存取，没缓存再联网
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});