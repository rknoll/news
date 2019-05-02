import { types } from '../actions/permissions';

const initialState = {
  notifications: (Notification && Notification.permission) || 'default',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE:
      return {
        ...state,
        ...action.permissions,
      };
    default:
      return state;
  }
};
