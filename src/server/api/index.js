import Router from 'express-promise-router';
import news from './news';
import subscriptions from './subscriptions';

export default () => {
  const router = Router();

  router
    .use('/news', news())
    .use('/subscriptions', subscriptions());

  return router;
};
