import qs from 'qs';

export const baseRequest = ({ url, data, query, method = 'GET', json = true } = {}) => {
  const requestUrl = query ? `${url}?${qs.stringify(query)}` : url;

  return new Promise((resolve, reject) => {
    fetch(requestUrl, {
      credentials: 'include',
      headers: {
        Accept: json ? 'application/json' : '*/*',
        'Content-Type': 'application/json'
      },
      method,
      body: data ? JSON.stringify(data) : undefined
    }).then((response) => {
        const parsed = json ? response.json() : response.blob();

        if (response.status >= 200 && response.status < 300) {
          return parsed;
        } else {
          return parsed.then(Promise.reject.bind(Promise));
        }
      })
      .then(resolve)
      .catch(reject);
  });
};

export const newsListRequest = () => baseRequest({ url: '/api/news' });
