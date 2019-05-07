import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Notifications from '../components/Notifications';
import Dialogs from './Dialogs';
import mainTheme from '../theme';
import dialogActions, {DIALOGS} from '../store/actions/dialogs';
import appActions from '../store/actions/app';
import newsActions from '../store/actions/news';

const styles = (theme) => ({
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
  title: {
    cursor: 'pointer',
  },
});

const ApplicationLayout = (props) => (
  <React.Fragment>
    <div className={props.classes.root}>
      <AppBar position='fixed' className={props.classes.appBar}>
        <Toolbar variant='dense' className={props.classes.toolbar}>
          <Typography variant='h6' color='inherit' noWrap={true} className={props.classes.title} onClick={props.navigateHome}>
            News
          </Typography>
          <div>
            { props.updateWorker &&
            <IconButton color='inherit' onClick={() => props.updateApp(props.updateWorker)}>
              <SystemUpdateIcon />
            </IconButton> }
            { props.installEvent &&
            <IconButton color='inherit' onClick={props.installApp}>
              <AddToHomeScreenIcon />
            </IconButton> }
            { (props.notificationPermissions === 'default' || props.notificationPermissions === 'prompt') &&
            <IconButton color='inherit' onClick={props.showNotificationDialog}>
              <Badge badgeContent={1} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton> }
            { props.hasSubscription &&
            <IconButton color='inherit' onClick={props.pushNews}>
              <NotificationsIcon />
            </IconButton> }
          </div>
        </Toolbar>
        {props.loading !== 0 && <LinearProgress variant='indeterminate' classes={{ root: props.classes.loadingBar }} />}
      </AppBar>
      <Dialogs />
      <main className={props.classes.content}>
        {props.children}
      </main>
    </div>
    <Notifications />
  </React.Fragment>
);

const mapStateToProps = (state) => ({
  loading: state.app.loading,
  notificationPermissions: state.permissions.notifications,
  hasSubscription: !!state.push.subscription,
  installEvent: state.app.installEvent,
  updateWorker: state.app.updateWorker,
});

const mapDispatchToProps = (dispatch) => ({
  showNotificationDialog: () => dispatch(dialogActions.show(DIALOGS.NOTIFICATIONS)),
  pushNews: () => dispatch(newsActions.pushNewsRequest()),
  installApp: () => dispatch(appActions.install()),
  navigateHome: () => dispatch(push('/')),
  updateApp: (worker) => worker.postMessage({ action: 'skipWaiting' }),
});

const StyledApp = withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ApplicationLayout));

export default (props) => <MuiThemeProvider theme={mainTheme}>
  <StyledApp {...props} />
</MuiThemeProvider>;
