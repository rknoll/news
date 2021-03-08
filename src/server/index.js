import express from 'express';
import compression from 'compression';
import path from 'path';
import bodyParser from 'body-parser';
import wellKnownRouter from './routers/wellKnown';
import apiRouter from './routers/api';
import imgRouter from './routers/img';
import delayRouter from './routers/delay';
import errorMiddleware from './middlewares/errorMiddleware';
import { scheduleUpdates } from './services/updater';

const statics = path.join(__dirname, '../../public');

const app = express();
const port = process.env.PORT || 3000;

app
  .set('etag', false)
  .use(bodyParser.json({ limit: '15mb' }))
  .use(compression());

app
  .use('/.well-known', wellKnownRouter())
  .use('/api', apiRouter(), errorMiddleware())
  .use('/img', imgRouter())
  .use('/delay', delayRouter(statics));

app.use((req, res, next) => {
  res.set('Origin-Trial', 'AqRfBkjHVSKNO1Xg0JWnNr7l84VzW+dPVvnkxLgqY8vrIpuIL2wmkj0ujA+DMvQ8XS2GWHb6uR/RSzWfpwN4uQMAAABqeyJvcmlnaW4iOiJodHRwczovL3Jrbm9sbC5hdDo0NDMiLCJmZWF0dXJlIjoiTm90aWZpY2F0aW9uVHJpZ2dlcnMiLCJleHBpcnkiOjE2MDQ2ODA3MjAsImlzU3ViZG9tYWluIjp0cnVlfQ==');
  next();
});

app
  .use(express.static(statics))
  .get('*', (req, res) => res.sendFile(path.join(statics, 'index.html')));

app.listen(port, () => console.log(`Listening on port ${port}!`));

scheduleUpdates();
