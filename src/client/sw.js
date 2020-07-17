import { newsRequest } from './api';
import newsActions from './store/actions/news';
import db from './helpers/db';
import { push } from 'connected-react-router';
import uuid from 'uuid/v1';
import iconRed from './assets/icon-red.png';

const imagesKey = 'news-images';
const assetsKey = `news-assets-${ASSETS_VERSION}`;
const allKeys = new Set([imagesKey, assetsKey]);

const cacheAssets = async (key, urls) => {
  const cache = await caches.open(key);
  try {
    return await cache.addAll(urls);
  } catch (error) {
    console.log(error && error.message || error);
  }
};

const handleActivate = async () => {
  await clients.claim();
  const cacheKeys = await caches.keys();
  const oldCacheKeys = cacheKeys.filter(key => !allKeys.has(key));
  return Promise.all(oldCacheKeys.map(key => caches.delete(key)));
};

const queryAssetsCache = async (request) => {
  const match = await caches.match(request, {ignoreSearch: true});
  if (match) return match;

  const url = new URL(request.url);
  if (url.pathname === '/' || url.pathname.startsWith('/news/')) {
    const match = await caches.match('/index.html', {ignoreSearch: true});
    if (match) return match;
  }

  return fetch(request);
};

const addNews = async (news, notify) => {
  await Promise.all([db.add(news), cacheAssets(imagesKey, [news.iconUrl])]);

  const clientList = await clients.matchAll({ type: 'window' });
  const refreshMessage = newsActions.refreshNewsRequest();
  clientList.forEach(client => client.postMessage(refreshMessage));

  if ('index' in self.registration) {
    await self.registration.index.add({
      id: news.id,
      title: news.title,
      description: news.description,
      category: 'article',
      icons: [
        {
          src: news.iconUrl,
          sizes: '64x64',
          type: 'image/png',
        },
      ],
      url: `/news/${news.id}`,
      launchUrl: `/news/${news.id}`,
    });
  }

  if (notify) {
    await self.registration.showNotification(news.title, {
      tag: news.id,
      body: news.description,
      icon: news.iconUrl,
    });
  }
};

const handlePush = async (data) => {
  const news = await newsRequest(data.id);
  return addNews(news, !data.silent);
};

const closeNotifications = async () => {
  const notifications = await self.registration.getNotifications();
  return Promise.all(notifications.map(notification => notification.close()));
};

const removeIndexEntries = async () => {
  if ('index' in self.registration) {
    const entries = await self.registration.index.getAll();
    await Promise.all(entries.map(entry => self.registration.index.delete(entry.id)));
  }
};

const createNews = ({ title, description }) => {
  const id = uuid();
  const news = {
    id,
    title,
    description,
    iconUrl: iconRed,
    timestamp: new Date().toISOString(),
  };
  return addNews(news, false);
};

const handleMessage = (event) => {
  switch (event.data.action) {
    case 'skipWaiting':
      return self.skipWaiting();
    case 'clearNews':
      return Promise.all([
        caches.delete(imagesKey),
        closeNotifications(),
        removeIndexEntries(),
      ]);
    case 'createNews':
      return createNews(event.data.data);
    case 'closeNotifications':
      return closeNotifications();
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

self.addEventListener('install', event => event.waitUntil(cacheAssets(assetsKey, serviceWorkerOption.assets)));
self.addEventListener('activate', event => event.waitUntil(handleActivate()));
self.addEventListener('fetch', event => event.respondWith(queryAssetsCache(event.request)));
self.addEventListener('push', event => event.waitUntil(handlePush(event.data.json())));
self.addEventListener('notificationclick', event => event.waitUntil(handleClickEvent(event)));
self.addEventListener('message', event => event.waitUntil(handleMessage(event)));
