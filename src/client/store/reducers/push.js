import { types } from '../actions/push';

const initialState = {
  subscribed: false,
  serviceWorker: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_SUBSCRIBED:
      return {
        ...state,
        subscribed: action.subscribed,
      };
    case types.UPDATE_SERVICE_WORKER:
      return {
        ...state,
        serviceWorker: action.serviceWorker,
      };
    default:
      return state;
  }
};
