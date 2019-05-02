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
      padding: '0 12px',
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
  headerExpanded: {
    '& $headerContent': {
      margin: '13px 0',
    },
  },
  title: {
    fontSize: theme.typography.pxToRem(15),
  },
  details: {
    overflow: 'auto',
    width: '100%',
    display: 'block',
    [theme.breakpoints.down('xs')]: {
      padding: '8px 12px 24px',
    },
  },
  description: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    float: 'right',
    width: '40px',
    height: '40px',
    marginLeft: '8px',
    marginBottom: '8px',
  },
});

const NewsBlock = (props) => {
  const { classes, selected, select, news } = props;

  const details = selected && <ExpansionPanelDetails className={classes.details}>
    <img className={classes.icon} src={news.iconUrl} />
    <Typography className={classes.description}>{news.description}</Typography>
  </ExpansionPanelDetails>;

  return (
    <ExpansionPanel classes={{ expanded: classes.headerExpanded }} className={classes.root}
                    expanded={selected} onChange={select}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                             classes={{ expandIcon: classes.expand, content: classes.headerContent }}
                             className={classes.summary}>
        <Typography className={classes.title}>{news.title}</Typography>
      </ExpansionPanelSummary>
      {details}
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
