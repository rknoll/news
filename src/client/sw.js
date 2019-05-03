import {newsListRequest} from './api';
import newsActions from './store/actions/news';

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

  const clientList = await clients.matchAll({ type: 'window' });
  clientList.forEach(client => client.postMessage(newsActions.newsListRequest()));
  console.log('Sent newsListRequest to ' + clientList.length + ' clients');

  return self.registration.showNotification(data.title, {
    body: data.description || undefined,
    icon: data.iconUrl,
    data: { id: data.id },
  });
}

async function handleClickEvent({notification, action}) {
  if (action === 'close') return notification.close();
  await notification.close();
  const clientList = await clients.matchAll({ type: 'window' });
  if (!clientList.length) return clients.openWindow(`/?open=${notification.data.id}`);
  clientList[0].postMessage(newsActions.select(notification.data.id));
  return clientList[0].focus();
}

self.addEventListener('install', event => event.waitUntil(cacheAssets()));
self.addEventListener('fetch', event => event.respondWith(queryAssetsCache(event.request)));
self.addEventListener('push', event => event.waitUntil(handlePush(event.data.json())));
self.addEventListener('notificationclick', event => event.waitUntil(handleClickEvent(event)));
