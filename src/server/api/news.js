import Router from 'express-promise-router';
import { getNews } from '../services/news';

export default () => {
  const router = Router();

  router.get('/', async (req, res) => {
    console.log('Got GET request');
    const news = await getNews();
    res.send(news);
  });

  return router;
};
