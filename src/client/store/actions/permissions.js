import actionTypes from '../../decorators/actionTypes';

export const types = actionTypes('permissions')({
  REQUEST: 'REQUEST',
  UPDATE: 'UPDATE',
});

export default {
  requestPermissions: () => ({
    type: types.REQUEST,
  }),
  updatePermissions: (permissions) => ({
    type: types.UPDATE,
    permissions,
  }),
};
