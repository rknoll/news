import actionTypes from '../../decorators/actionTypes';

export const types = actionTypes('requirements')({
  CHECK: 'CHECK',
  UPDATE: 'UPDATE',
});

export default {
  checkRequirements: () => ({
    type: types.CHECK,
  }),
  updateRequirements: (requirements) => ({
    type: types.UPDATE,
    requirements,
  }),
};
