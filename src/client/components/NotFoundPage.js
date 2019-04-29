import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    padding: '16px',
  },
});

const NotFoundPage = (props) => (
  <div className={props.classes.root}>
    <Typography variant='h6' color='inherit'>
      404 <Link to='/'>Go home</Link>
    </Typography>
  </div>
);

export default withStyles(styles)(NotFoundPage);
