import React from 'react';
import { connect } from 'react-redux';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/es/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import dialogActions, { DIALOGS } from '../../store/actions/dialogs';
import newsActions from '../../store/actions/news';

const defaultState = {
  open: false,
  title: '',
  description: '',
};

const styles = (theme) => ({
  title: {
    margin: 0,
    padding: theme.spacing.unit * 2,
    paddingBottom: 0,
  },
  content: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  actions: {
    margin: 0,
    padding: theme.spacing.unit,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
});

const mapStateToProps = ({ dialogs }) => ({
  ...dialogs[DIALOGS.CREATE_NEWS],
});

const mapDispatchToProps = (dispatch) => ({
  hideCreateNewsDialog: () => dispatch(dialogActions.hide(DIALOGS.CREATE_NEWS)),
  createNews: (data) => dispatch(newsActions.createNews(data)),
});

@withStyles(styles)
@withMobileDialog({ breakpoint: 'xs' })
@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.Component {
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

  handleCreateBackup = (event) => {
    event.preventDefault();
    if (this.isBlocked()) return;
    this.props.createNews({
      title: this.state.title,
      description: this.state.description,
    });
  };

  handleTitleChange = (event) => this.setState({ title: event.target.value });
  handleDescriptionChange = (event) => this.setState({ description: event.target.value });
  isBlocked = () => !this.state.title || !this.state.description;

  render() {
    const { fullScreen, loading, classes, hideCreateNewsDialog } = this.props;
    const { open, title, description } = this.state;
    const blocked = this.isBlocked();

    return <Dialog open={open} fullScreen={fullScreen} fullWidth={true}
                   maxWidth={fullScreen ? false : 'xs'}>
      <DialogTitle className={classes.title} disableTypography={true}>
        <Typography variant='h6' color='inherit'>
          Create news
        </Typography>
        <IconButton aria-label="Close" className={classes.closeButton} onClick={hideCreateNewsDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <TextField
          disabled={loading}
          autoFocus={true}
          margin='dense'
          id='title'
          label='Title'
          type='text'
          placeholder='Title'
          defaultValue={title}
          fullWidth={true}
          onChange={this.handleTitleChange}
        />
        <TextField
          disabled={loading}
          margin='dense'
          id='description'
          label='Description'
          type='text'
          placeholder='Description'
          defaultValue={description}
          fullWidth={true}
          onChange={this.handleDescriptionChange}
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={this.handleCreateBackup} color="primary" disabled={blocked}>
          Create
        </Button>
      </DialogActions>
      {loading && <LinearProgress variant='indeterminate' />}
    </Dialog>;
  }
}
