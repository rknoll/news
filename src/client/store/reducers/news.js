import { types } from '../actions/news';

const initialState = {
  selected: {},
  list: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SELECT:
      return {
        ...state,
        selected: {
          ...state.selected,
          [action.id]: !state.selected[action.id],
        },
      };
    case types.REFRESH_NEWS_RESPONSE:
      return {
        ...state,
        list: action.data,
      };
    default:
      return state;
  }
};
