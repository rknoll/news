import { types } from '../actions/news';

const initialState = {
  selected: {},
  list: null,
};

const params = new URLSearchParams(window.location.search);
if (params.has('open')) initialState.selected[params.get('open')] = true;

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
    case types.NEWS_LIST_RESPONSE:
      return {
        ...state,
        list: action.data,
      };
    default:
      return state;
  }
};
