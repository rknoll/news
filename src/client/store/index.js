import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history';
import createRootReducer from './reducers';
import sagas from './sagas';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  createRootReducer(history),
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware
    )
  )
);

sagaMiddleware.run(sagas);

if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextCreateRootReducer = require('./reducers').default;
    store.replaceReducer(nextCreateRootReducer(history));
  });
}

export default store;
