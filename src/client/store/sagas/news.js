import { put, takeEvery, call } from 'redux-saga/effects';
import newsActions, { types } from '../actions/news';
import appActions from '../actions/app';
import { newsListRequest } from '../../api';
import request from './request';

async function addToCaches(data) {
  const cache = await caches.open('news-assets');
  const keys = await cache.keys();
  const existingEntries = new Set(keys.map(k => new URL(k.url).pathname));
  const addingEntries = new Set(data.map(d => d.iconUrl));
  existingEntries.forEach(existing => addingEntries.delete(existing));
  return cache.addAll([...addingEntries]);
}

function* getNewsList() {
  try {
    const data = yield request(newsListRequest);
    yield call(addToCaches, data);
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
