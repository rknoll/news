import { call, put } from 'redux-saga/effects';
import appActions from '../actions/app';

export default function* (request, ...args) {
  yield put(appActions.loading(true));

  try {
    return yield call(request, ...args);
  } finally {
    yield put(appActions.loading(false));
  }
}
