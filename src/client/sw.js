async function cacheAssets() {
  const cache = await caches.open('news-assets');
  return cache.addAll([...serviceWorkerOption.assets, '/']);
}

async function queryAssetsCache(request) {
  const cache = await caches.open('news-assets');
  const match = await cache.match(request);
  return match || fetch(request);
}

async function handlePush(data) {
  const cache = await caches.open('news-assets');
  await cache.add(data.iconUrl);
  return self.registration.showNotification(data.title, {
    body: data.description || undefined,
    icon: data.iconUrl,
  });
}

self.addEventListener('install', event => event.waitUntil(cacheAssets()));
self.addEventListener('fetch', event => event.respondWith(queryAssetsCache(event.request)));
self.addEventListener('push', event => event.waitUntil(handlePush(event.data.json())));
