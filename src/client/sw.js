import { newsRequest } from './api';
import newsActions from './store/actions/news';
import db  from './helpers/db';
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
  if (!url.pathname.startsWith('/img/') &&
      !url.pathname.startsWith('/api/') &&
      !url.pathname.endsWith('.hot-update.json') &&
      !url.pathname.endsWith('.hot-update.js')) {
    const match = await cache.match('/index.html', {ignoreSearch: true});
    if (match) return match;
  }

  return fetch(request);
};

const handlePush = async (data) => {
  const news = await newsRequest(data.id);
  await Promise.all([db.add(news), cacheAssets([news.imageUrl])]);

  const clientList = await clients.matchAll({ type: 'window' });
  const refreshMessage = newsActions.refreshNewsRequest();
  clientList.forEach(client => client.postMessage(refreshMessage));

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

const handleMessage = async (event) => {
  switch (event.data.action) {
    case 'skipWaiting':
      return self.skipWaiting();
    case 'clearNews':
      if (!('index' in self.registration)) return;
      const entries = await self.registration.index.list();
      return Promise.all(entries.map(entry => self.registration.index.remove(entry.id)));
    default:
      return;
  }
};

const handleClickEvent = async ({notification, action}) => {
  await notification.close();
  if (action === 'close') return;

  const clientList = await clients.matchAll({ type: 'window' });
  if (!clientList.length) return clients.openWindow(`/news/${notification.tag}`);

  clientList[0].postMessage(push(`/news/${notification.tag}`));
  return clientList[0].focus();
};

self.addEventListener('install', event => event.waitUntil(cacheAssets(serviceWorkerOption.assets)));
self.addEventListener('activate', event => event.waitUntil(clients.claim()));
self.addEventListener('fetch', event => event.respondWith(queryAssetsCache(event.request)));
self.addEventListener('push', event => event.waitUntil(handlePush(event.data.json())));
self.addEventListener('notificationclick', event => event.waitUntil(handleClickEvent(event)));
self.addEventListener('message', event => event.waitUntil(handleMessage(event)));
