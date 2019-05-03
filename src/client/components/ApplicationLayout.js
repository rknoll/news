import React from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Notifications from '../components/Notifications';
import Dialogs from './Dialogs';
import mainTheme from '../theme';
import dialogActions, {DIALOGS} from '../store/actions/dialogs';
import appActions from '../store/actions/app';

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
  flex: {
    flexGrow: 1,
  },
});

const ApplicationLayout = (props) => (
  <React.Fragment>
    <div className={props.classes.root}>
      <AppBar position='fixed' className={props.classes.appBar}>
        <Toolbar variant='dense' className={props.classes.toolbar}>
          <Typography variant='h6' color='inherit' noWrap={true} className={props.classes.flex}>
            News
          </Typography>
          { (props.notificationPermissions === 'default' || props.notificationPermissions === 'prompt') &&
          <IconButton color='inherit' onClick={props.showNotificationDialog}>
            <Badge badgeContent={1} color='secondary'>
              <NotificationsIcon />
            </Badge>
          </IconButton> }
          { props.installEvent &&
          <IconButton color='inherit' onClick={props.installApp}>
            <AddToHomeScreenIcon />
          </IconButton> }
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
  installEvent: state.app.installEvent,
});

const mapDispatchToProps = (dispatch) => ({
  showNotificationDialog: () => dispatch(dialogActions.show(DIALOGS.NOTIFICATIONS)),
  installApp: () => dispatch(appActions.install()),
});

const StyledApp = withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ApplicationLayout));

export default (props) => <MuiThemeProvider theme={mainTheme}>
  <StyledApp {...props} />
</MuiThemeProvider>;
