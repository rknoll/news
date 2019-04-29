import { all } from 'redux-saga/effects';
import news from './news';
import dialogs from './dialogs';

export default function* () {
  yield all([
    ...news(),
    ...dialogs(),
  ]);
}
