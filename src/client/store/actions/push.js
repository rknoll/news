import actionTypes from '../../decorators/actionTypes';

export const types = actionTypes('push')({
  UPDATE_SUBSCRIBED: 'UPDATE_SUBSCRIBED',
});

export default {
  updateSubscribed: (subscribed) => ({
    type: types.UPDATE_SUBSCRIBED,
    subscribed,
  }),
};
