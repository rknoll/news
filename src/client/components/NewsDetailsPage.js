import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import newsActions from "../store/actions/news";

const styles = () => ({
  root: {
    width: '100%',
  },
});

class NewsDetailsPage extends React.Component {
  componentDidMount() {
    this.props.refreshNews();
  }

  render() {
    const { classes, list, match } = this.props;

    if (!list) return <div className={classes.root}>
      Loading..
    </div>;

    const news = list.find(n => n.id === match.params.id);
    if (!news) return <div className={classes.root}>
      Not found!
    </div>;

    return (
      <div className={classes.root}>
        Details! {JSON.stringify(news)}
      </div>
    );
  }
}

const mapStateToProps = ({ news }) => ({
  list: news.list,
});

export const mapDispatchToProps = (dispatch) => ({
  refreshNews: () => dispatch(newsActions.newsListRequest()),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NewsDetailsPage));
