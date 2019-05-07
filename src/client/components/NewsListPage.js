import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import News from './News';

const styles = () => ({
  root: {
    width: '100%',
    maxWidth: 800,
    margin: 'auto',
  },
});

const NewsListPage = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <News />
    </div>
  );
};

export default withStyles(styles)(NewsListPage);
