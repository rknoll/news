import actionTypes from '../../decorators/actionTypes';

export const types = actionTypes('push')({
  UPDATE_SUBSCRIBED: 'UPDATE_SUBSCRIBED',
  UPDATE_SERVICE_WORKER: 'UPDATE_SERVICE_WORKER',
});

export default {
  updateSubscribed: (subscribed) => ({
    type: types.UPDATE_SUBSCRIBED,
    subscribed,
  }),
  updateServiceWorker: (serviceWorker) => ({
    type: types.UPDATE_SERVICE_WORKER,
    serviceWorker,
  }),
};
