import React from 'react';
import NewsBlock from './NewsBlock';
import { withStyles } from '@material-ui/core/styles';
import newsActions from '../store/actions/news';
import { connect } from 'react-redux';
import { orderProperty, stableSort } from '../helpers/sorting';

const styles = (theme) => ({
  root: {
    padding: 0,
    [theme.breakpoints.up('sm')]: {
      padding: '16px',
    },
    '@media all and (display-mode: standalone)': {
      padding: 0,
    },
  },
});

class News extends React.Component {
  componentDidMount() {
    this.props.refreshNews();
  }

  render() {
    const { classes } = this.props;
    const news = stableSort(this.props.news || [], orderProperty('timestamp'), 'desc');
    return (
      <div className={classes.root}>
        {news.map(n => (<NewsBlock news={n} key={n.id} />))}
      </div>
    );
  }
}

const mapStateToProps = ({ news }) => ({
  news: news.list,
});

export const mapDispatchToProps = (dispatch) => ({
  refreshNews: () => dispatch(newsActions.newsListRequest()),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(News));
