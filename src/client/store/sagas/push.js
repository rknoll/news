import { put, takeEvery, select, call } from 'redux-saga/effects';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import { types as requirementTypes } from '../actions/requirements';
import pushActions from '../actions/push';
import {subscribeRequest} from '../../api';
import {urlBase64ToUint8Array} from '../../helpers/encoding';

async function subscribe() {
  if (!('serviceWorker' in navigator)) throw new Error('serviceWorker not supported by this browser');
  if (!('PushManager' in window)) throw new Error('Push messaging isn\'t supported.');
  console.log('registering..');
  const registration = await runtime.register();
  console.log('waiting to be ready..');
  await navigator.serviceWorker.ready;
  console.log('subscribing..');
  const result = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.WEBPUSH__PUBLIC_KEY)
  });
  console.log('persisting on server..');
  await subscribeRequest(result);
}

function* updateSubscription() {
  const state = yield select();
  if (state.permissions.notifications === 'granted') {
    if (!state.push.subscribed) {
      yield put(pushActions.updateSubscribed(true));
      try {
        yield call(subscribe);
        console.log('Subscribed!');
      } catch (error) {
        yield put(pushActions.updateSubscribed(false));
      }
    }
  }
}

function* watchRequirementsUpdate() {
  yield takeEvery(requirementTypes.UPDATE, updateSubscription);
}

export default () => [
  watchRequirementsUpdate(),
];
