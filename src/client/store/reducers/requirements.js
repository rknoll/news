import { types } from '../actions/requirements';

const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE:
      return {
        ...state,
        ...action.requirements,
      };
    default:
      return state;
  }
};
