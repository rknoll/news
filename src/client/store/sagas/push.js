import { put, takeEvery, select, call } from 'redux-saga/effects';
import { types as requirementTypes } from '../actions/requirements';
import pushActions from '../actions/push';
import appActions from '../actions/app';
import { urlBase64ToUint8Array } from '../../helpers/encoding';

async function subscribe() {
  console.log('In subscribe(), waiting for navigator.serviceWorker.ready');
  const registration = await navigator.serviceWorker.ready;
  console.log('In subscribe(), waiting for registration.pushManager.getSubscription');
  const subscription = await registration.pushManager.getSubscription();
  console.log('In subscribe(), done!');
  return subscription || registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.WEBPUSH__PUBLIC_KEY),
  });
}

function* updateSubscription() {
  const state = yield select();

  if (Object.values(state.requirements).includes(false)) return;
  if (!state.requirements.notifications) return;
  if (state.push.subscribing || state.push.subscription) return;

  try {
    yield put(appActions.loading(true));
    yield put(pushActions.updateSubscribing(true));
    const subscription = yield call(subscribe);
    yield put(pushActions.updateSubscription(subscription));
  } catch (error) {
    yield put(appActions.error(error));
  } finally {
    yield put(appActions.loading(false));
    yield put(pushActions.updateSubscribing(false));
  }
}

function* watchRequirementsUpdate() {
  yield takeEvery(requirementTypes.UPDATE, updateSubscription);
}

export default () => [
  watchRequirementsUpdate(),
];
