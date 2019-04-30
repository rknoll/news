import React from 'react';
import { connect } from 'react-redux';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import dialogActions, { DIALOGS } from '../store/actions/dialogs';
import permissionActions from '../store/actions/permissions';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const defaultState = {
  open: false,
};

const styles = (theme) => ({
  title: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
  content: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  actions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
});

export class NotificationsDialog extends React.Component {
  state = defaultState;

  static getDerivedStateFromProps({ show }, state) {
    if (Boolean(show) === Boolean(state.open)) {
      return state;
    } else if (!show) {
      return { open: false };
    } else {
      return {
        ...defaultState,
        open: true,
      };
    }
  }

  render() {
    const { fullScreen, classes, requestPermissions, closeNotificationsDialog } = this.props;
    const { open } = this.state;

    return <Dialog open={open} fullScreen={fullScreen} fullWidth={true}
                   maxWidth={fullScreen ? false : 'xs'}>
      <DialogTitle className={classes.title} disableTypography={true}>
        <Typography variant='h6' color='inherit'>
          Allow notifications
        </Typography>
        <IconButton aria-label="Close" className={classes.closeButton} onClick={closeNotificationsDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography variant='body2' color='inherit'>
          We'd like to send you breaking news articles as soon as they happen. Please allow notifications in your browser for us to notify you.
        </Typography>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={requestPermissions} color="primary">
          Allow Notifications
        </Button>
      </DialogActions>
    </Dialog>;
  }
}

const mapStateToProps = ({ dialogs }) => ({
  ...dialogs[DIALOGS.NOTIFICATIONS],
});

const mapDispatchToProps = (dispatch) => ({
  closeNotificationsDialog: () => dispatch(dialogActions.hide(DIALOGS.NOTIFICATIONS)),
  requestPermissions: () => dispatch(permissionActions.requestPermissions()),
});

export default withStyles(styles)(withMobileDialog({ breakpoint: 'xs' })(connect(mapStateToProps, mapDispatchToProps)(NotificationsDialog)));
