import Router from 'express-promise-router';
import { getNews, getNewsImage, getRandomNews } from '../services/db';
import { notify } from '../services/push';

export default () => {
  const router = Router();

  router.get('/news/:id', async (req, res) => {
    console.log(`GET /news/${req.params.id}`);
    const news = await getNews(req.params.id);
    res.send(news);
  });

  router.get('/news/:id/image', async (req, res) => {
    console.log(`GET /news/${req.params.id}/image`);
    const image = await getNewsImage(req.params.id);
    res.setHeader('content-type', 'image/png');
    res.send(image);
  });

  router.post('/news', async (req, res) => {
    console.log('POST /news');
    const news = await getRandomNews();
    await notify(req.body, news);
    res.send({ success: true });
  });

  return router;
};
