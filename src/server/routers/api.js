import Router from 'express-promise-router';
import { getNews, getRandomNews } from '../services/db';
import { notify } from '../services/push';

const addIconUrl = (news) => ({
  ...news,
  timestamp: new Date().toISOString(),
  iconUrl: `/img/${news.id}`,
});

export default () => {
  const router = Router();

  router.get('/news/:id', async (req, res) => {
    console.log(`GET /api/news/${req.params.id}`);
    const news = await getNews(req.params.id);
    res.send(addIconUrl(news));
  });

  router.post('/news', async (req, res) => {
    console.log('POST /api/news');
    const news = await getRandomNews();
    await notify(req.body, { id: news.id });
    res.send({ success: true });
  });

  return router;
};
