import { put, takeEvery, call } from 'redux-saga/effects';
import newsActions, { types } from '../actions/news';
import appActions from '../actions/app';
import { newsListRequest } from '../../api';
import request from './request';
import { forwardActions } from '../../helpers/sagas';
import { eventChannel } from 'redux-saga';

async function addToCaches(data) {
  const cache = await caches.open('news-assets');
  const keys = await cache.keys();
  const existingEntries = new Set(keys.map(k => new URL(k.url).pathname));
  const addingEntries = new Set(data.map(d => d.iconUrl));
  existingEntries.forEach(existing => addingEntries.delete(existing));
  return cache.addAll([...addingEntries]);
}

async function gotMessage() {
  return eventChannel(emitter => {
    if (!('serviceWorker' in navigator)) return () => {};
    const listener = message => emitter(newsActions.select(message.data.id));
    navigator.serviceWorker.addEventListener('message', listener);
    return () => navigator.serviceWorker.removeEventListener('message', listener);
  });
}

function* getNewsList() {
  try {
    yield put(appActions.loading(true));
    const data = yield request(newsListRequest);
    yield put(newsActions.newsListResponse(data));
    yield call(addToCaches, data);
  } catch (error) {
    yield put(appActions.error(error));
  } finally {
    yield put(appActions.loading(false));
  }
}

function* watchGetNewsList() {
  yield takeEvery(types.NEWS_LIST_REQUEST, getNewsList);
}

export default () => [
  watchGetNewsList(),
  forwardActions(gotMessage),
];
