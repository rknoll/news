import { all } from 'redux-saga/effects';
import news from './news';
import dialogs from './dialogs';
import permissions from './permissions';
import requirements from './requirements';
import push from './push';
import app from './app';

export default function* () {
  yield all([
    ...news(),
    ...dialogs(),
    ...permissions(),
    ...requirements(),
    ...push(),
    ...app(),
  ]);
}
