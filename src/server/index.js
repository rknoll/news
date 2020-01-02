import express from 'express';
import compression from 'compression';
import path from 'path';
import bodyParser from 'body-parser';
import wellKnownRouter from './routers/wellKnown';
import apiRouter from './routers/api';
import imgRouter from './routers/img';
import errorMiddleware from './middlewares/errorMiddleware';
import { scheduleUpdates } from './services/updater';

const statics = path.join(__dirname, '../../public');

const app = express();
const port = process.env.PORT || 3000;

app
  .use(bodyParser.json({ limit: '15mb' }))
  .use(compression());

app
  .use('/.well-known', wellKnownRouter())
  .use('/api', apiRouter(), errorMiddleware())
  .use('/img', imgRouter());

app.use((req, res, next) => {
  res.set('Origin-Trial', 'AmRML4eQ7EYkH3h2gxrjfsjcdUBG/qcAbE7nTr6jsNcZ0wlRWZNGKdvmvQt9WuajpoqIlNbzLI4R4DSnDZqMxwQAAABUeyJvcmlnaW4iOiJodHRwczovL25ld3Mucmtub2xsLmF0OjQ0MyIsImZlYXR1cmUiOiJDb250ZW50SW5kZXgiLCJleHBpcnkiOjE1ODE2MDkzMjR9');
  next();
});

app
  .use(express.static(statics))
  .get('*', (req, res) => res.sendFile(path.join(statics, 'index.html')));

app.listen(port, () => console.log(`Listening on port ${port}!`));

scheduleUpdates();
