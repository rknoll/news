import express from 'express';
import compression from 'compression';
import path from 'path';
import bodyParser from 'body-parser';
import apiRouter from './api';
import { scheduleUpdates } from './services/updater';

const statics = path.resolve(__dirname, '../../public');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '15mb' }));
app.use(compression());
app.use('/api', apiRouter());
app.use('/favicon.ico', express.static(path.join(statics, 'img')));
app.use(express.static(statics));
app.get('*', (req, res) => res.sendFile(path.join(statics, 'index.html')));

app.listen(port, () => console.log(`Listening on port ${port}!`));

scheduleUpdates();
