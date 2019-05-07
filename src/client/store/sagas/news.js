import { put, takeEvery, call, select } from 'redux-saga/effects';
import newsActions, { types } from '../actions/news';
import appActions from '../actions/app';
import { getAll } from '../../helpers/db';
import { pushNewsRequest } from '../../api';
import request  from './request';

function* getNewsList() {
  yield put(appActions.loading(true));
  try {
    const news = yield call(getAll);
    yield put(newsActions.newsListResponse(news));
  } catch (error) {
    yield put(appActions.error(error));
  } finally {
    yield put(appActions.loading(false));
  }
}

function* pushNews() {
  yield put(appActions.loading(true));
  try {
    const state = yield select();
    const subscription = state.push.subscription;
    const response = yield request(pushNewsRequest, subscription);
    yield put(newsActions.pushNewsResponse(response));
  } catch (error) {
    yield put(appActions.error(error));
  } finally {
    yield put(appActions.loading(false));
  }
}

function* watchGetNewsList() {
  yield takeEvery(types.NEWS_LIST_REQUEST, getNewsList);
}

function* watchPushNews() {
  yield takeEvery(types.PUSH_NEWS_REQUEST, pushNews);
}

export default () => [
  watchGetNewsList(),
  watchPushNews(),
];
