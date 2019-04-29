import { put, takeEvery } from 'redux-saga/effects';
import { types } from '../actions/dialogs';
import notificationActions from '../actions/notifications';

function* showError({ data }) {
  yield put(notificationActions.show({
    message: data && data.error && data.error.message || 'An unexpected error occurred',
    type: 'error',
  }));
}

function* watchError() {
  yield takeEvery(types.ERROR, showError);
}

export default () => [
  watchError(),
];
