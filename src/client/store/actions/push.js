import actionTypes from '../../decorators/actionTypes';

export const types = actionTypes('push')({
  UPDATE_SUBSCRIBING: 'UPDATE_SUBSCRIBING',
  UPDATE_SUBSCRIPTION: 'UPDATE_SUBSCRIPTION',
});

export default {
  updateSubscribing: (subscribing) => ({
    type: types.UPDATE_SUBSCRIBING,
    subscribing,
  }),
  updateSubscription: (subscription) => ({
    type: types.UPDATE_SUBSCRIPTION,
    subscription,
  }),
};
