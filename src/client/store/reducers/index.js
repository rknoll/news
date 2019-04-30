import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import news from './news';
import dialogs from './dialogs';
import notifications from './notifications';
import app from './app';
import permissions from './permissions';

export default (history) => combineReducers({
  router: connectRouter(history),
  news,
  dialogs,
  notifications,
  app,
  permissions,
});
