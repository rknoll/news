import { put, takeEvery, select } from 'redux-saga/effects';
import requirementActions, { types as requirementTypes } from '../actions/requirements';
import { types as permissionTypes } from '../actions/permissions';
import dialogActions, { DIALOGS } from '../actions/dialogs';

function* updateRequirements() {
  const requirements = {};
  const state = yield select();

  requirements.notifications = state.permissions.notifications !== 'denied';

  yield put(requirementActions.updateRequirements(requirements));
  if (Object.values(requirements).includes(false)) {
    yield put(dialogActions.show(DIALOGS.REQUIREMENTS, {requirements}));
  } else {
    yield put(dialogActions.hide(DIALOGS.REQUIREMENTS));
  }
}

function* watchRequirementsCheck() {
  yield takeEvery(requirementTypes.CHECK, updateRequirements);
}

function* watchPermissionsUpdate() {
  yield takeEvery(permissionTypes.UPDATE, updateRequirements);
}

export default () => [
  watchRequirementsCheck(),
  watchPermissionsUpdate(),
];
