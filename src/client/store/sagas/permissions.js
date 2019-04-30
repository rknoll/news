import { call, put, takeEvery, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga'
import permissionActions, { types } from '../actions/permissions';
import dialogActions, { DIALOGS } from '../actions/dialogs';

function permissionChanged() {
  return eventChannel(emitter => {
    let unsubscribe = () => unsubscribe = undefined;

    navigator.permissions.query({ name: 'notifications' }).then(function(result) {
      if (!unsubscribe) return;
      const trigger = () => emitter(permissionActions.updatePermissions({notifications: result.state}));
      result.onchange = trigger;
      unsubscribe = () => result.onchange = undefined;
      trigger();
    });

    return unsubscribe;
  });
}

function* requestPermissions() {
  yield call(Notification.requestPermission);
  const result = Notification.permission;
  yield put(permissionActions.updatePermissions({notifications: result}));
  if (result !== 'default') {
    yield put(dialogActions.hide(DIALOGS.NOTIFICATIONS));
  }
}

function* watchRequest() {
  yield takeEvery(types.REQUEST, requestPermissions);
}

function* forwardActions(source) {
  const channel = yield call(source);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

export default () => [
  watchRequest(),
  forwardActions(permissionChanged),
];
