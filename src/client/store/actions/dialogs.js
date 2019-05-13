import actionTypes from '../../decorators/actionTypes';

export const types = actionTypes('dialogs')({
  SHOW: 'SHOW',
  HIDE: 'HIDE',
  SUBMIT: 'SUBMIT',
  ERROR: 'ERROR'
});

export const DIALOGS = {
  REQUIREMENTS: 'REQUIREMENTS',
  NOTIFICATIONS: 'NOTIFICATIONS',
  CREATE_NEWS: 'CREATE_NEWS',
};

export default {
  show: (dialog, data) => ({
    type: types.SHOW,
    dialog,
    data,
  }),
  hide: (dialog) => ({
    type: types.HIDE,
    dialog,
  }),
  submit: (dialog) => ({
    type: types.SUBMIT,
    dialog,
  }),
  error: (dialog, data) => ({
    type: types.ERROR,
    dialog,
    data,
  }),
};
