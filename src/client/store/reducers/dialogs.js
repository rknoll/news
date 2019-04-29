import { DIALOGS, types } from '../actions/dialogs';

const defaultState = Object.keys(DIALOGS).reduce((state, dialog) => ({
  ...state,
  [dialog]: {
    show: false,
    loading: false
  }
}), {});

const scoped = (state, action, func) => {
  if (!Object.prototype.hasOwnProperty.call(state, action.dialog)) {
    return state;
  }

  return {
    ...state,
    [action.dialog]: func(state[action.dialog], action)
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case types.SHOW:
      return {
        ...action.data,
        show: true,
        loading: false,
      };
    case types.HIDE:
      return {
        show: false,
        loading: false,
      };
    case types.SUBMIT:
      return {
        ...state,
        loading: true,
      };
    case types.ERROR:
      return {
        ...state,
        ...action.data,
        loading: false,
      };
    default:
      return state;
  }
};

export default (state = defaultState, action) => scoped(state, action, reducer);
