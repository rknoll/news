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

const defaultState = {
  open: false,
};

const styles = () => ({
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
    const { fullScreen, requirements } = this.props;
    const { open } = this.state;

    const missingRequirements = requirements && <React.Fragment>
      {!requirements.notifications && <Typography variant='body2' color='inherit'>Notification permission</Typography>}
      {!requirements.serviceWorker && <Typography variant='body2' color='inherit'>ServiceWorker support</Typography>}
      {!requirements.pushManager && <Typography variant='body2' color='inherit'>PushManager support</Typography>}
    </React.Fragment>;

    return <Dialog open={open} fullScreen={fullScreen} fullWidth={true}
                   maxWidth={fullScreen ? false : 'xs'}>
      <DialogTitle disableTypography={true}>
        <Typography variant='h6' color='inherit'>
          Missing requirements
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant='body2' color='inherit'>
          This browser is missing some requirements:
        </Typography>
        { missingRequirements }
      </DialogContent>
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
