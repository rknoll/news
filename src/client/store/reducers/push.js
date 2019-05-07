import { types } from '../actions/push';

const initialState = {
  subscribing: false,
  subscription: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_SUBSCRIBING:
      return {
        ...state,
        subscribing: action.subscribing,
      };
    case types.UPDATE_SUBSCRIPTION:
      return {
        ...state,
        subscription: action.subscription,
      };
    default:
      return state;
  }
};
