import { put, takeEvery, select } from 'redux-saga/effects';
import appActions, { types } from '../actions/app';
import notificationActions from '../actions/notifications';
import {eventChannel} from 'redux-saga';
import {forwardActions} from '../../helpers/sagas';

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

function* showError({ data }) {
  yield put(notificationActions.show({
    message: data && data.error && data.error.message || 'An unexpected error occurred',
    type: 'error',
  }));
}

function* installApp() {
  const state = yield select();
  const event = state.app.installEvent;
  if (!event) return;
  yield put(appActions.installable(null));
  event.prompt();
  const result = yield event.userChoice;
  console.log(result);
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
];
