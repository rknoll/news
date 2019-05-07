import { types } from '../actions/app';

const initialState = {
  loading: 0,
  installEvent: null,
  updateWorker: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOADING:
      return {
        ...state,
        loading: state.loading + (action.loading ? 1 : -1),
      };
    case types.INSTALLABLE:
      return {
        ...state,
        installEvent: action.event,
      };
    case types.UPDATABLE:
      return {
        ...state,
        updateWorker: action.worker,
      };
    default:
      return state;
  }
};
