import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import notificationActions from '../store/actions/notifications';

const styles = (theme) => ({
  root: {
    zIndex: theme.zIndex.snackbar
  },
  success: {
    backgroundColor: theme.palette.primary.main
  },
  error: {
    backgroundColor: theme.palette.error.main
  },
  info: {
    backgroundColor: theme.palette.secondary.main
  },
  warning: {
    backgroundColor: theme.palette.warning.main
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  }
});

const ICONS = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

export class Notifications extends React.Component {
  handleHideNotification = (event, reason) => {
    if (reason !== 'clickaway') {
      this.props.hideNotification();
    }
  };

  handleRemoveNotification = () => {
    this.props.removeNotification();
  };

  render() {
    const { notifications, classes } = this.props;

    return notifications.map((notification, index) => {
      const type = notification.type || 'info';
      const Icon = ICONS[type];

      return <Snackbar
        className={classes.root}
        key={index}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={notification.show}
        autoHideDuration={5000}
        onClose={this.handleHideNotification}
        onExited={this.handleRemoveNotification}
      >
        <SnackbarContent
          className={classes[type]}
          message={<span className={classes.message}>
            <Icon className={classes.icon} />
            {notification.message}
          </span>}
          action={<IconButton
            onClick={this.handleHideNotification}
            color={'inherit'}
          >
            <CloseIcon />
          </IconButton>}
        />
      </Snackbar>;
    });
  }
}

const mapStateToProps = ({ notifications }) => ({ notifications });

const mapDispatchToProps = (dispatch) => ({
  hideNotification: () => dispatch(notificationActions.hide()),
  removeNotification: () => dispatch(notificationActions.remove()),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Notifications));
