import actionTypes from '../../decorators/actionTypes';

export const types = actionTypes('news')({
  SELECT: 'SELECT',
  NEWS_LIST_REQUEST: 'NEWS_LIST_REQUEST',
  NEWS_LIST_RESPONSE: 'NEWS_LIST_RESPONSE',
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
};
