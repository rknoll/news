import { all } from 'redux-saga/effects';
import news from './news';
import dialogs from './dialogs';
import permissions from './permissions';
import requirements from './requirements';

export default function* () {
  yield all([
    ...news(),
    ...dialogs(),
    ...permissions(),
    ...requirements(),
  ]);
}
