import qs from 'qs';

export const baseRequest = async ({ url, data, query, method = 'GET', json = true, cacheData = false } = {}) => {
  const requestUrl = query ? `${url}?${qs.stringify(query)}` : url;

  const responseToPromise = (cacheResponse) => async (response) => {
    if (cacheResponse) {
      try {
        const cache = await caches.open('news-api');
        await cache.put(requestUrl, response.clone());
      } catch (ignored) {}
    }

    const parsed = json ? response.json() : response.blob();

    if (response.status >= 200 && response.status < 300) {
      return parsed;
    } else {
      return parsed.then(Promise.reject.bind(Promise));
    }
  };

  const maybeTryCache = (resolve, reject) => async (error) => {
    if (cacheData) {
      try {
        const match = await caches.match(requestUrl);
        if (match) return resolve(await responseToPromise(false)(match));
      } catch (ignored) {
      }
    }
    return reject(error);
  };

  return new Promise((resolve, reject) => {
    fetch(requestUrl, {
      credentials: 'include',
      headers: {
        Accept: json ? 'application/json' : '*/*',
        'Content-Type': 'application/json'
      },
      method,
      body: data ? JSON.stringify(data) : undefined
    }).then(responseToPromise(cacheData))
      .then(resolve)
      .catch(maybeTryCache(resolve, reject));
  });
};

export const newsListRequest = () => baseRequest({ url: '/api/news', cacheData: true });

export const subscribeRequest = (data) => baseRequest({ url: '/api/subscriptions', method: 'POST', data });
