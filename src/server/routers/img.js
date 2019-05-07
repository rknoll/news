import Router from 'express-promise-router';
import { getNewsImage } from '../services/db';

export default () => {
  const router = Router();

  router.get('/:id', async (req, res) => {
    console.log(`GET /img/${req.params.id}`);
    const image = await getNewsImage(req.params.id);
    res.setHeader('content-type', 'image/png');
    res.send(image);
  });

  return router;
};
