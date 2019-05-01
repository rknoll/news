import 'url-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import App from './components/App';
import store, { history } from './store';
import { urlBase64ToUint8Array } from './helpers/encoding';
import { subscribeRequest } from './api';
import './styles/styles.css';
import './img/icon.png';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component history={history} />
      </Provider>
    </AppContainer>,
    document.getElementById('app')
  );
};

if (window.self === window.top) {
  render(App);
}

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/App', () => {
    // eslint-disable-next-line no-console
    console.log('Reloading UI');

    // eslint-disable-next-line global-require
    render(require('./components/App').default);
  });
}

async function subscribe() {
  if (!('serviceWorker' in navigator)) throw new Error('serviceWorker not supported by this browser');
  if (!('PushManager' in window)) throw new Error('Push messaging isn\'t supported.');
  const registration = await runtime.register();
  await navigator.serviceWorker.ready;
  const result = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.WEBPUSH__PUBLIC_KEY)
  });
  await subscribeRequest(result);
}

subscribe().then(() => {
  console.log('Subscribed!');
}, (error) => {
  console.error(error && error.message || error);
});
