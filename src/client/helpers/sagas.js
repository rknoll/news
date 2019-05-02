import { call, put, take } from 'redux-saga/effects';

export function* forwardActions(source) {
  const channel = yield call(source);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}
