import fs from 'fs';
import path from 'path';
import Router from 'express-promise-router';
import { getNewsImage } from '../services/db';

export default (statics) => {
  const router = Router();
  const imagePath = path.join(statics, './assets/cat.jpg');

  router.get('/:ms', async (req, res, next) => {
    console.log(`GET /delay/${req.params.ms}`);
    const delay = parseInt(req.params.ms);
    setTimeout(() => fs.readFile(imagePath, (err, image) => {
      if (err) return next(err);
      res.set('Cache-Control', 'no-store');
      res.setHeader('content-type', 'image/png');
      res.send(image);
    }), delay);
  });

  return router;
};
