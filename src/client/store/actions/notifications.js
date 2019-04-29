import actionTypes from '../../decorators/actionTypes';

export const types = actionTypes('notifications')({
  SHOW: 'SHOW',
  HIDE: 'HIDE',
  REMOVE: 'REMOVE'
});

export default {
  show: (data) => ({
    type: types.SHOW,
    data
  }),
  hide: () => ({
    type: types.HIDE
  }),
  remove: () => ({
    type: types.REMOVE
  })
};
