import React  from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen';
import DeleteIcon from '@material-ui/icons/Delete';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import BugReportIcon from '@material-ui/icons/BugReport';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Notifications from '../components/Notifications';
import Dialogs from './dialogs';
import dialogActions, {DIALOGS} from '../store/actions/dialogs';
import appActions from '../store/actions/app';
import newsActions from '../store/actions/news';
import icon from '../assets/icon.png';
import LongPressIconButton from './LongPressIconButton';

const styles = (theme) => ({
  "@keyframes opacityPulse": {
    '0%': {opacity: 0.2},
    '50%': {opacity: 0.5},
    '100%': {opacity: 0.2},
  },
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: theme.zIndex.root,
    overflow: 'hidden',
    display: 'flex',
  },
  loadingBar: {
    marginTop: -5,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: {
    minHeight: '48px',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '24px',
      paddingRight: '24px',
    },
  },
  content: {
    width: '100%',
    padding: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 3 + 48,
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing.unit,
      paddingTop: theme.spacing.unit + 48,
    },
    '@media all and (display-mode: standalone)': {
      padding: theme.spacing.unit,
      paddingTop: theme.spacing.unit + 48,
    },
    minWidth: 0,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  titleText: {
    textTransform: 'none',
  },
  updateLoading: {
    animation: 'opacityPulse 2s ease-out',
    animationIterationCount: 'infinite',
    opacity: 1,
  },
  installSpinner: {
    position: 'absolute',
  },
});

const debugValues = {
  'NOTIFICATIONS': 'List notifications',
};
if (ServiceWorkerRegistration.prototype.hasOwnProperty('index')) {
  debugValues['CONTENT_INDEX'] = 'List content index';
}

const handleDebugNotifications = async () => {
  const registration = await navigator.serviceWorker.ready;
  const notifications = await registration.getNotifications();
  const data = notifications.map(({title, body}) => ({
    title,
    body,
  }));
  alert(JSON.stringify(data));
};

const handleDebugContentIndex = async () => {
  const registration = await navigator.serviceWorker.ready;
  const entries = await registration.index.list();
  alert(JSON.stringify(entries));
};

const handleDebug = (selection) => {
  const handlers = {
    'NOTIFICATIONS': handleDebugNotifications,
    'CONTENT_INDEX': handleDebugContentIndex,
  };
  const handler = handlers[selection || 'NOTIFICATIONS'];
  return handler && handler();
};

const ApplicationLayout = (props) => {
  const iconUpdate = !!props.update.worker;
  const updateLoading = props.update.loading;
  const iconInstall = !!props.installEvent;
  const iconPermission = props.notificationPermissions === 'default' || props.notificationPermissions === 'prompt';
  const iconPush = !iconPermission && props.hasSubscription && !!navigator.serviceWorker.controller;
  const iconClear = props.hasNews;

  const delayValues = {
    0: 'Now',
    5: 'In 5 Seconds',
    10: 'In 10 Seconds',
    60: 'In 1 Minute',
    [-5]: 'In 5 Seconds - Don\'t wait for event',
  };

  return (
    <React.Fragment>
      <div className={props.classes.root}>
        <AppBar position='fixed' className={props.classes.appBar}>
          <Toolbar variant='dense' className={props.classes.toolbar}>
            <Button onClick={props.navigateHome} color='inherit'>
              <img src={icon} className={props.classes.icon} />
              <Typography variant='h6' color='inherit' noWrap={true} className={props.classes.titleText}>
                News
              </Typography>
            </Button>
            <div>
              <LongPressIconButton icon={<BugReportIcon />} onClick={handleDebug} values={debugValues} />
              <LongPressIconButton icon={<VisibilityOffIcon />} onClick={props.pushNews(true)} values={delayValues} />
              { iconUpdate &&
              <IconButton color='inherit' onClick={() => !updateLoading && props.updateApp(props.update.worker)}>
                <SystemUpdateIcon className={updateLoading ? props.classes.updateLoading : ''} />
                {updateLoading && <CircularProgress variant='indeterminate' color='inherit' size={24}
                                  className={props.classes.installSpinner}/>
                }
              </IconButton> }
              { iconInstall &&
              <IconButton color='inherit' onClick={props.installApp}>
                <AddToHomeScreenIcon />
              </IconButton> }
              { iconPermission &&
              <IconButton color='inherit' onClick={props.showNotificationDialog}>
                <Badge badgeContent={1} color='secondary'>
                  <NotificationsIcon />
                </Badge>
              </IconButton> }
              { iconClear &&
              <IconButton color='inherit' onClick={props.clearNews}>
                <DeleteIcon />
              </IconButton> }
              { iconPush && <LongPressIconButton
                icon={<NotificationsIcon />} onClick={props.pushNews(false)} values={delayValues} />
              }
            </div>
          </Toolbar>
          {props.loading && <LinearProgress variant='indeterminate' classes={{ root: props.classes.loadingBar }} />}
        </AppBar>
        <Dialogs />
        <main className={props.classes.content}>
          {props.children}
        </main>
      </div>
      <Notifications />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  loading: state.app.longLoading,
  notificationPermissions: state.permissions.notifications,
  hasSubscription: !!state.push.subscription,
  installEvent: state.app.installEvent,
  update: state.app.update,
  hasNews: state.news.list && state.news.list.length !== 0,
});

const mapDispatchToProps = (dispatch) => ({
  showNotificationDialog: () => dispatch(dialogActions.show(DIALOGS.NOTIFICATIONS)),
  clearNews: () => dispatch(newsActions.clearNews()),
  pushNews: (silent) => (delay) => dispatch(newsActions.pushNewsRequest(silent, delay)),
  installApp: () => dispatch(appActions.install()),
  navigateHome: () => dispatch(push('/')),
  updateApp: (worker) => worker.postMessage({ action: 'skipWaiting' }),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ApplicationLayout));
