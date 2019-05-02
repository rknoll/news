import { types } from '../actions/push';

const initialState = {
  subscribed: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_SUBSCRIBED:
      return {
        ...state,
        subscribed: action.subscribed,
      };
    default:
      return state;
  }
};
