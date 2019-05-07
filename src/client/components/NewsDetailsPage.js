import React from 'react';
import dayjs from 'dayjs';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import newsActions from '../store/actions/news';

dayjs.extend(LocalizedFormat);

const styles = () => ({
  notFound: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  homeButton: {
    marginTop: 16,
  },
  root: {
    width: '100%',
    maxWidth: 800,
    margin: 'auto',
  },
  titleRow: {
    padding: '24px 24px 0 24px',
    overflow: 'auto',
  },
  image: {
    borderRadius: 4,
    float: 'left',
    margin: '0 24px 24px 0',
  },
  title: {
    marginBottom: 24,
  },
  descriptionRow: {
    padding: '0 24px 24px 24px',
  },
  timestamp: {
    textAlign: 'end',
    marginTop: 8,
  },
});

class NewsDetailsPage extends React.Component {
  componentDidMount() {
    this.props.refreshNews();
  }

  render() {
    const { classes, list, match } = this.props;
    if (!list) return null;

    const news = list.find(n => n.id === match.params.id);
    if (!news) return <div className={classes.notFound}>
      <Typography variant='body1'>
        Could not find news article.
      </Typography>
      <Button className={classes.homeButton} onClick={this.props.navigateHome}>
        Go home
      </Button>
    </div>;

    return (
      <Paper className={classes.root}>
        <div className={classes.titleRow}>
          <img src={news.imageUrl} className={classes.image} />
          <Typography variant='h5' className={classes.title}>
            {news.title}
          </Typography>
        </div>
        <div className={classes.descriptionRow}>
          <Typography variant='body1'>
            {news.description}
          </Typography>
          <Typography variant='caption' className={classes.timestamp}>
            {dayjs(news.timestamp).format('llll')}
          </Typography>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = ({ news }) => ({
  list: news.list,
});

export const mapDispatchToProps = (dispatch) => ({
  refreshNews: () => dispatch(newsActions.refreshNewsRequest()),
  navigateHome: () => dispatch(push('/')),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NewsDetailsPage));
