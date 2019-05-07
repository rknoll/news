import { newsRequest } from './api';
import newsActions from './store/actions/news';
import { add } from './helpers/db';
import { push } from 'connected-react-router';

const cacheAssets = async (urls) => {
  const cache = await caches.open('news-assets');
  return cache.addAll(urls);
};

const queryAssetsCache = async (request) => {
  const cache = await caches.open('news-assets');
  const match = await cache.match(request, {ignoreSearch: true});
  if (match) return match;

  const url = new URL(request.url);
  if (!url.pathname.startsWith('/img/') && !url.pathname.startsWith('/api/')) {
    const match = await cache.match('/index.html', {ignoreSearch: true});
    if (match) return match;
  }

  return fetch(request);
};

const handlePush = async (data) => {
  const news = await newsRequest(data.id);
  await Promise.all([add(news), cacheAssets([news.imageUrl])]);

  const clientList = await clients.matchAll({ type: 'window' });
  clientList.forEach(client => client.postMessage(newsActions.newsListRequest()));

  if ('index' in self.registration) {
    await self.registration.index.add({
      id: news.id,
      title: news.title,
      description: news.description,
      category: 'article',
      iconUrl: news.imageUrl,
      launchUrl: `https://news.rknoll.at/news/${news.id}`,
    });
  }

  return self.registration.showNotification(news.title, {
    tag: news.id,
    body: news.description,
    icon: news.imageUrl,
  });
};

const handleClickEvent = async ({notification, action}) => {
  await notification.close();
  if (action === 'close') return;

  const clientList = await clients.matchAll({ type: 'window' });
  if (!clientList.length) return clients.openWindow(`/news/${notification.tag}`);

  clientList[0].postMessage(push(`/news/${notification.tag}`));
  return clientList[0].focus();
};

const handleMessage = (event) => {
  if (event.data.action === 'skipWaiting') self.skipWaiting();
};

self.addEventListener('install', event => event.waitUntil(cacheAssets(serviceWorkerOption.assets)));
self.addEventListener('activate', event => event.waitUntil(clients.claim()));
self.addEventListener('fetch', event => event.respondWith(queryAssetsCache(event.request)));
self.addEventListener('push', event => event.waitUntil(handlePush(event.data.json())));
self.addEventListener('notificationclick', event => event.waitUntil(handleClickEvent(event)));
self.addEventListener('message', handleMessage);
