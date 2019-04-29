import { types } from '../actions/notifications';

const setShowFirst = (show) => (data, index) => index ? data : { ...data, show };
const removeFirst = (_, index) => index;

export default (state = [], action) => {
  switch (action.type) {
    case types.SHOW:
      return state.length ?
        state.map(setShowFirst(false)).concat({ ...action.data, show: false }) :
        [{ ...action.data, show: true }];
    case types.HIDE:
      return state.map(setShowFirst(false));
    case types.REMOVE:
      return state.filter(removeFirst).map(setShowFirst(true));
    default:
      return state;
  }
};
