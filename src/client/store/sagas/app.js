import { put, takeEvery, select, take, race, delay } from 'redux-saga/effects';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import appActions, { types } from '../actions/app';
import notificationActions from '../actions/notifications';
import { eventChannel } from 'redux-saga';
import { forwardActions } from '../../helpers/sagas';
import requirementActions from '../actions/requirements';

const MIN_LOADING_MILLIS = 200;

async function gotMessage() {
  return eventChannel(emitter => {
    if (!('serviceWorker' in navigator)) return () => {};
    const listener = message => emitter(message.data);
    navigator.serviceWorker.addEventListener('message', listener);
    return () => navigator.serviceWorker.removeEventListener('message', listener);
  });
}

function installable() {
  return eventChannel(emitter => {
    const listener = event => {
      event.preventDefault();
      emitter(appActions.installable(event));
    };
    window.addEventListener('beforeinstallprompt', listener);
    return () => window.removeEventListener('beforeinstallprompt', listener);
  });
}

function updateAvailable() {
  return eventChannel(emitter => {
    if (!('serviceWorker' in navigator)) return () => {};

    const gotWorker = (worker) => {
      emitter(appActions.updatable({
        worker,
        loading: worker.state === 'installing',
      }));
      worker.addEventListener('statechange', () => {
        if (worker.state !== 'installed') return;
        if (!navigator.serviceWorker.controller) return;
        emitter(appActions.updatable({
          worker,
          loading: false,
        }));
      });
    };

    const checkWorkers = (registration) => () => {
      if (registration.installing) gotWorker(registration.installing);
      if (registration.waiting) gotWorker(registration.waiting);
    };

    runtime.register().then(registration => {
      const check = checkWorkers(registration);
      registration.addEventListener('updatefound', check);
      check();
    });

    const isControlled = !!navigator.serviceWorker.controller;
    const changeHandler = () => {
      if (isControlled) {
        navigator.serviceWorker.removeEventListener('controllerchange', changeHandler);
        return window.location.reload();
      }
      emitter(requirementActions.checkRequirements());
      emitter(appActions.updatable({ worker: null, loading: false }));
    };
    navigator.serviceWorker.addEventListener('controllerchange', changeHandler);

    return () => {};
  });
}

function* showError({ error }) {
  yield put(notificationActions.show({
    message: error && error.message || 'An unexpected error occurred',
    type: 'error',
  }));
}

function* installApp() {
  const state = yield select();
  const event = state.app.installEvent;
  if (!event) return;
  yield put(appActions.installable(null));
  event.prompt();
  yield event.userChoice;
}

function* watchError() {
  yield takeEvery(types.ERROR, showError);
}

function* watchInstall() {
  yield takeEvery(types.INSTALL, installApp);
}

function* isLoading() {
  const state = yield select();
  return !!state.app.loading;
}

function* watchLoading() {
  while (true) {
    while (!(yield isLoading())) yield take(types.LOADING);
    const endMillis = Date.now() + MIN_LOADING_MILLIS;

    while (yield isLoading()) {
      if (Date.now() >= endMillis) break;
      yield race([take(types.LOADING), delay(endMillis - Date.now())]);
    }

    if (yield isLoading()) yield put(appActions.longLoading(true));
    while (yield isLoading()) yield take(types.LOADING);
    yield put(appActions.longLoading(false));
  }
}

export default () => [
  watchError(),
  watchInstall(),
  watchLoading(),
  forwardActions(gotMessage),
  forwardActions(installable),
  forwardActions(updateAvailable),
];
