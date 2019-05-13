import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import dialogActions, {DIALOGS} from '../store/actions/dialogs';
import News from './News';

const styles = (theme) => ({
  root: {
    width: '100%',
    maxWidth: 800,
    margin: 'auto',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: theme.zIndex.fab
  },
});

const NewsListPage = (props) => {
  const { classes, showNewsDialog } = props;
  return (
    <div className={classes.root}>
      <News />
      <Fab className={classes.fab} color={'secondary'}
           onClick={showNewsDialog}>
        <AddIcon />
      </Fab>
    </div>
  );
};

const mapStateToProps = () => ({});

export const mapDispatchToProps = (dispatch) => ({
  showNewsDialog: () => dispatch(dialogActions.show(DIALOGS.CREATE_NEWS)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NewsListPage));
