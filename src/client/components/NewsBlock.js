import React from 'react';
import newsActions from '../store/actions/news';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    color: theme.palette.text.primary,
  },
  summary: {
    [theme.breakpoints.down('xs')]: {
      padding: '0 0 0 12px',
    },
  },
  expand: {
    [theme.breakpoints.down('xs')]: {
      right: 0,
    },
  },
  headerContent: {
    margin: '13px 0',
  },
  header: {
    display: 'flex',
    '&>$secondaryHeading': {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  headerExpanded: {
    '& $secondaryHeading': {
      [theme.breakpoints.down('xs')]: {
        display: 'block',
      },
    },
    '& $headerContent': {
      margin: '13px 0',
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

const NewsBlock = (props) => {
  const { classes, selected, select, news } = props;
  return (
    <ExpansionPanel classes={{ expanded: classes.headerExpanded }} className={classes.root}
                    expanded={selected} onChange={select}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                             classes={{ expandIcon: classes.expand, content: classes.headerContent }}
                             className={classes.summary}>
        <div className={classes.header}>
          <Typography className={classes.heading}>{news.title}</Typography>
          <Typography className={classes.secondaryHeading}>{news.description}</Typography>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {news.id}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const mapStateToProps = ({ news }, ownProps) => ({
  selected: news.selected && news.selected[ownProps.news.id],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  select: () => dispatch(newsActions.select(ownProps.news.id)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NewsBlock));
