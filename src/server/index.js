import express from 'express';
import compression from 'compression';
import path from 'path';
import bodyParser from 'body-parser';
import apiRouter from './routers/api';
import imgRouter from './routers/img';
import { scheduleUpdates } from './services/updater';

const statics = path.join(__dirname, '../../public');

const app = express();
const port = process.env.PORT || 3000;

app
  .use(bodyParser.json({ limit: '15mb' }))
  .use(compression());

app
  .use('/api', apiRouter())
  .use('/img', imgRouter());

app
  .use(express.static(statics))
  .get('*', (req, res) => res.sendFile(path.join(statics, 'index.html')));

app.listen(port, () => console.log(`Listening on port ${port}!`));

scheduleUpdates();
