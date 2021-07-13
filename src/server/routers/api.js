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
    const { silent, delay, subscription, doNotWaitForEvent, useForcedID } = req.body;
    const news = await getRandomNews();
    const data = { id: news.id, silent, doNotWaitForEvent, useForcedID };
    if (delay) {
      setTimeout(async () => {
        try {
          await notify(subscription, data);
        } catch (error) {
          console.log(error && error.message || error);
        }
      }, delay * 1000);
    } else {
      await notify(subscription, data);
    }
    res.send({ success: true });
  });

  return router;
};
