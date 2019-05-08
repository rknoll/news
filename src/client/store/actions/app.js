import actionTypes from '../../decorators/actionTypes';

export const types = actionTypes('app')({
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  INSTALLABLE: 'INSTALLABLE',
  INSTALL: 'INSTALL',
  UPDATABLE: 'UPDATABLE',
});

export default {
  loading: (loading) => ({
    type: types.LOADING,
    loading,
  }),
  error: (error) => ({
    type: types.ERROR,
    error,
  }),
  installable: (event) => ({
    type: types.INSTALLABLE,
    event,
  }),
  install: () => ({
    type: types.INSTALL,
  }),
  updatable: ({ worker, loading }) => ({
    type: types.UPDATABLE,
    worker,
    loading,
  })
};
