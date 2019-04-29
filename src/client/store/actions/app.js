import actionTypes from '../../decorators/actionTypes';

export const types = actionTypes('app')({
  LOADING: 'LOADING',
  ERROR: 'ERROR',
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
};
