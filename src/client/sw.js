import {newsListRequest} from './api';

async function cacheAssets() {
  const cache = await caches.open('news-assets');
  return cache.addAll([...serviceWorkerOption.assets, '/']);
}

async function queryAssetsCache(request) {
  const cache = await caches.open('news-assets');
  const match = await cache.match(request, {ignoreSearch: true});
  return match || fetch(request);
}

async function handlePush(data) {
  const cache = await caches.open('news-assets');
  await Promise.all([cache.add(data.iconUrl), newsListRequest()]);
  return self.registration.showNotification(data.title, {
    body: data.description || undefined,
    icon: data.iconUrl,
    data: { id: data.id },
  });
}

async function handleClickEvent({notification, action}) {
  if (action === 'close') return notification.close();
  await notification.close();
  const windows = await clients.matchAll({ type: 'window' });
  if (!windows || !windows.length) return clients.openWindow(`/?open=${notification.data.id}`);
  const client = windows[0];
  client.postMessage({ id: notification.data.id });
  return client.focus();
}

self.addEventListener('install', event => event.waitUntil(cacheAssets()));
self.addEventListener('fetch', event => event.respondWith(queryAssetsCache(event.request)));
self.addEventListener('push', event => event.waitUntil(handlePush(event.data.json())));
self.addEventListener('notificationclick', event => event.waitUntil(handleClickEvent(event)));
