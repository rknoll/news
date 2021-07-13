import { put, takeEvery, call, select } from 'redux-saga/effects';
import newsActions, { types } from '../actions/news';
import dialogActions, { DIALOGS } from '../actions/dialogs';
import appActions from '../actions/app';
import { getAll, clear } from '../../helpers/db';
import { pushNewsRequest } from '../../api';
import request  from './request';

function* refreshNews() {
  yield put(appActions.loading(true));
  try {
    const news = yield call(getAll);
    yield put(newsActions.refreshNewsResponse(news));
  } catch (error) {
    yield put(appActions.error(error));
  } finally {
    yield put(appActions.loading(false));
  }
}

function* pushNews({ data }) {
  yield put(appActions.loading(true));
  try {
    const state = yield select();
    const subscription = state.push.subscription;
    const response = yield request(pushNewsRequest, { subscription, ...data });
    yield put(newsActions.pushNewsResponse(response));
  } catch (error) {
    yield put(appActions.error(error));
  } finally {
    yield put(appActions.loading(false));
  }
}

function* clearNews() {
  yield put(appActions.loading(true));
  try {
    navigator.serviceWorker.controller.postMessage({ action: 'clearNews' });
    yield call(clear);
    yield put(newsActions.refreshNewsRequest());
  } catch (error) {
    yield put(appActions.error(error));
  } finally {
    yield put(appActions.loading(false));
  }
}

function* createNews({ data }) {
  yield put(dialogActions.submit(DIALOGS.CREATE_NEWS));
  try {
    navigator.serviceWorker.controller.postMessage({ action: 'createNews', data });
    yield put(dialogActions.hide(DIALOGS.CREATE_NEWS));
  } catch (error) {
    yield put(dialogActions.error(error));
  }
}

function* watchRefreshNews() {
  yield takeEvery(types.REFRESH_NEWS_REQUEST, refreshNews);
}

function* watchPushNews() {
  yield takeEvery(types.PUSH_NEWS_REQUEST, pushNews);
}

function* watchClearNews() {
  yield takeEvery(types.CLEAR_NEWS, clearNews);
}

function* watchCreateNews() {
  yield takeEvery(types.CREATE_NEWS, createNews);
}

export default () => [
  watchRefreshNews(),
  watchPushNews(),
  watchClearNews(),
  watchCreateNews(),
];
