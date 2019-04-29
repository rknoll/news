import { put, takeEvery } from 'redux-saga/effects';
import newsActions, { types } from '../actions/news';
import appActions from '../actions/app';
import { newsListRequest, newsDetailsRequest } from '../../api';
import request from './request';

function* getNewsList() {
  try {
    const data = yield request(newsListRequest);

    yield put(newsActions.newsListResponse(data));
  } catch (error) {
    yield put(appActions.error(error));
  }
}

function* watchGetNewsList() {
  yield takeEvery(types.NEWS_LIST_REQUEST, getNewsList);
}

export default () => [
  watchGetNewsList(),
];
