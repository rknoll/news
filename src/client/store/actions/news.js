import actionTypes from '../../decorators/actionTypes';

export const types = actionTypes('news')({
  SELECT: 'SELECT',
  NEWS_LIST_REQUEST: 'NEWS_LIST_REQUEST',
  NEWS_LIST_RESPONSE: 'NEWS_LIST_RESPONSE',
  PUSH_NEWS_REQUEST: 'PUSH_NEWS_REQUEST',
  PUSH_NEWS_RESPONSE: 'PUSH_NEWS_RESPONSE',
});

export default {
  select: (id) => ({
    type: types.SELECT,
    id,
  }),
  newsListRequest: () => ({
    type: types.NEWS_LIST_REQUEST,
  }),
  newsListResponse: (data) => ({
    type: types.NEWS_LIST_RESPONSE,
    data,
  }),
  pushNewsRequest: () => ({
    type: types.PUSH_NEWS_REQUEST,
  }),
  pushNewsResponse: (data) => ({
    type: types.PUSH_NEWS_RESPONSE,
    data,
  }),
};
