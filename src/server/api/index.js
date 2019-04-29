import Router from 'express-promise-router';
import news from './news';

export default () => {
  const router = Router();

  router
    .use('/news', news());

  return router;
};
