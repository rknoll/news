import Router from 'express-promise-router';
import {addSubscription} from '../services/subscriptions';

export default () => {
  const router = Router();

  router.post('/', async (req, res) => {
    console.log('Got /subscriptions POST request');
    await addSubscription(req.body);
    res.send({success: true});
  });

  return router;
};
