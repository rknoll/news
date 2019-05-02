import { call, put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga'
import permissionActions, { types } from '../actions/permissions';
import dialogActions, { DIALOGS } from '../actions/dialogs';
import { forwardActions } from '../../helpers/sagas';

function permissionChanged() {
  return eventChannel(emitter => {
    let unsubscribe = () => unsubscribe = undefined;

    if ('permissions' in navigator) {
      navigator.permissions.query({name: 'notifications'}).then(function (result) {
        if (!unsubscribe) return;
        const trigger = () => emitter(permissionActions.updatePermissions({notifications: result.state}));
        result.onchange = trigger;
        unsubscribe = () => result.onchange = undefined;
        trigger();
      });
    }

    return unsubscribe;
  });
}

const getPermission = () => new Promise((resolve) => {
  window.Notification.requestPermission(resolve);
});

function* requestPermissions() {
  console.log('requesting..');
  yield call(getPermission);
  const result = window.Notification.permission;
  console.log(`result: ${result}`);
  yield put(permissionActions.updatePermissions({notifications: result}));
  if (result !== 'default') {
    yield put(dialogActions.hide(DIALOGS.NOTIFICATIONS));
  }
}

function* watchRequest() {
  yield takeEvery(types.REQUEST, requestPermissions);
}

export default () => [
  watchRequest(),
  forwardActions(permissionChanged),
];
