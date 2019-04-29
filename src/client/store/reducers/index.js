import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import news from './news';
import dialogs from './dialogs';
import notifications from './notifications';
import app from './app';

export default (history) => combineReducers({
  router: connectRouter(history),
  news,
  dialogs,
  notifications,
  app,
});
