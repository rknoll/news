import 'url-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';
import store, { history } from './store';
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
