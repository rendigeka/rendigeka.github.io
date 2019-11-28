self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'payload kosong';
  }
  var options = {
    badge: 'asset/i-icon.png',
    icon: 'asset/g-icon.png',
    body: body, vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {action: 'close', title: 'Tutup'}
    ]
  };
  event.waitUntil(
    self.registration.showNotification('Pemberitahuan', options)
  );
});

self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const action = event.action;

  if (action === 'close') {
    notification.close();
  }
});

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');  

if (workbox){
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/asset/i-icon.png', revision: '1' },
    { url: '/asset/g-icon.png', revision: '1' },
    { url: '/asset/icon-192.png', revision: '1' },
    { url: '/asset/icon-512.png', revision: '1' },
    { url: '/asset/nav.html', revision: '1' },
    { url: '/css/main.css', revision: '1' },
    { url: '/css/iconfont.woff2', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/js/nav.js', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/main.js', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' }
  ]);

  workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'pwa2-image-cache',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ]
    })
  );

  console.log('[Workbox] berhasil dimuat');
}
else {
  console.log('[Workbox] gagal dimuat');
}