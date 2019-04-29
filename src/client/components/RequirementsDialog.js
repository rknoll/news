import React from 'react';
import { connect } from 'react-redux';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DIALOGS } from '../store/actions/dialogs';
import { withStyles } from '@material-ui/core/styles';

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

  render() {
    const { fullScreen } = this.props;
    const { open } = this.state;

    return <Dialog open={open} fullScreen={fullScreen} fullWidth={true}
                   maxWidth={fullScreen ? false : 'xs'}>
      <DialogTitle>
        Missing requirements
      </DialogTitle>
      <DialogContent>
        This browser is missing some requirements!
      </DialogContent>
    </Dialog>;
  }
}

const mapStateToProps = ({ dialogs }) => ({
  ...dialogs[DIALOGS.REQUIREMENTS],
});

const mapDispatchToProps = () => ({
});

export default withStyles(styles)(withMobileDialog({ breakpoint: 'xs' })(connect(mapStateToProps, mapDispatchToProps)(RequirementsDialog)));
