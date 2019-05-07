import React from 'react';
import { connect } from 'react-redux';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DIALOGS } from '../store/actions/dialogs';
import requirementActions from '../store/actions/requirements';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

const defaultState = {
  open: false,
};

const styles = (theme) => ({
  title: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
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

export class RequirementsDialog extends React.Component {
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

  componentDidMount() {
    this.props.checkRequirements();
  }

  render() {
    const { fullScreen, requirements, classes } = this.props;
    const { open } = this.state;

    const missingRequirements = requirements && <ul>
      {requirements.notifications === false && <li><Typography variant='body2' color='inherit'>Notification permission</Typography></li>}
      {requirements.serviceWorker === false && <li><Typography variant='body2' color='inherit'>ServiceWorker support</Typography></li>}
      {requirements.pushManager === false && <li><Typography variant='body2' color='inherit'>PushManager support</Typography></li>}
    </ul>;

    const handleReload = () => window.location.reload();

    return <Dialog open={open} fullScreen={fullScreen} fullWidth={true}
                   maxWidth={fullScreen ? false : 'xs'}>
      <DialogTitle className={classes.title} disableTypography={true}>
        <Typography variant='h6' color='inherit'>
          Missing requirements
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Typography variant='body2' color='inherit'>
          This browser is missing some requirements:
        </Typography>
        { missingRequirements }
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={handleReload} color='primary'>
          Reload
        </Button>
      </DialogActions>
    </Dialog>;
  }
}

const mapStateToProps = ({ dialogs, requirements }) => ({
  ...dialogs[DIALOGS.REQUIREMENTS],
  requirements,
});

const mapDispatchToProps = (dispatch) => ({
  checkRequirements: () => dispatch(requirementActions.checkRequirements()),
});

export default withStyles(styles)(withMobileDialog({ breakpoint: 'xs' })(connect(mapStateToProps, mapDispatchToProps)(RequirementsDialog)));
