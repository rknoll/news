import actionTypes from '../../decorators/actionTypes';

export const types = actionTypes('news')({
  SELECT: 'SELECT',
  REFRESH_NEWS_REQUEST: 'REFRESH_NEWS_REQUEST',
  REFRESH_NEWS_RESPONSE: 'REFRESH_NEWS_RESPONSE',
  PUSH_NEWS_REQUEST: 'PUSH_NEWS_REQUEST',
  PUSH_NEWS_RESPONSE: 'PUSH_NEWS_RESPONSE',
  CLEAR_NEWS: 'CLEAR_NEWS',
  CREATE_NEWS: 'CREATE_NEWS',
});

export default {
  select: (id) => ({
    type: types.SELECT,
    id,
  }),
  refreshNewsRequest: () => ({
    type: types.REFRESH_NEWS_REQUEST,
  }),
  refreshNewsResponse: (data) => ({
    type: types.REFRESH_NEWS_RESPONSE,
    data,
  }),
  pushNewsRequest: (data) => ({
    type: types.PUSH_NEWS_REQUEST,
    data,
  }),
  pushNewsResponse: (data) => ({
    type: types.PUSH_NEWS_RESPONSE,
    data,
  }),
  clearNews: () => ({
    type: types.CLEAR_NEWS,
  }),
  createNews: (data) => ({
    type: types.CREATE_NEWS,
    data,
  }),
};
