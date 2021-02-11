var cacheName = 'samurai_v1';
var filesToCache = [
  '/',
  '/build/bundle.css',
  '/build/bundle.js',
  '/index.html',
  '/global.css',
  '/peerjs.min.js',
  '/sw.js',
  '/install.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});