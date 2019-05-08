import { types } from '../actions/app';

const initialState = {
  loading: 0,
  longLoading: false,
  installEvent: null,
  update: {
    worker: null,
    loading: false,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOADING:
      return {
        ...state,
        loading: state.loading + (action.loading ? 1 : -1),
      };
    case types.LONG_LOADING:
      return {
        ...state,
        longLoading: action.longLoading,
      };
    case types.INSTALLABLE:
      return {
        ...state,
        installEvent: action.event,
      };
    case types.UPDATABLE:
      return {
        ...state,
        update: {
          ...state.update,
          worker: action.worker || null,
          loading: !!action.loading,
        },
      };
    default:
      return state;
  }
};
