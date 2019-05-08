import { put, takeEvery, select } from 'redux-saga/effects';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import appActions, { types } from '../actions/app';
import notificationActions from '../actions/notifications';
import { eventChannel } from 'redux-saga';
import { forwardActions } from '../../helpers/sagas';

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
        loading: true,
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

    const changeHandler = () => {
      navigator.serviceWorker.removeEventListener('controllerchange', changeHandler);
      window.location.reload();
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

export default () => [
  watchError(),
  watchInstall(),
  forwardActions(gotMessage),
  forwardActions(installable),
  forwardActions(updateAvailable),
];
