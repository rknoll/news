import React from 'react';
import newsActions from '../store/actions/news';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";

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
  image: {
    float: 'right',
    width: '40px',
    height: '40px',
    marginLeft: '8px',
    marginBottom: '8px',
  },
  actions: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

const NewsBlock = (props) => {
  const { classes, selected, select, news } = props;

  const details = selected && <ExpansionPanelDetails className={classes.details}>
    <img className={classes.image} src={news.imageUrl} />
    <Typography className={classes.description}>{news.description}</Typography>
  </ExpansionPanelDetails>;

  const openDetails = (event) => {
    event.stopPropagation();
    props.navigate(`/news/${news.id}`);
  };

  return (
    <ExpansionPanel classes={{ expanded: classes.headerExpanded }} className={classes.root}
                    expanded={Boolean(selected)} onChange={select}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                             classes={{ expandIcon: classes.expand, content: classes.headerContent }}
                             className={classes.summary}>
        <Typography className={classes.title}>{news.title}</Typography>
        <div className={classes.actions}>
          <IconButton onClick={openDetails}>
            <OpenInBrowserIcon />
          </IconButton>
        </div>
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
  navigate: (url) => dispatch(push(url)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NewsBlock));
