import express from 'express';
import compression from 'compression';
import path from 'path';
import bodyParser from 'body-parser';
import apiRouter from './api';

const statics = path.resolve(__dirname, '../../public');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '15mb' }));
app.use(compression());
app.use('/api', apiRouter());
app.use('/favicon.ico', express.static('img'));
app.use(express.static(statics));

app.listen(port, () => console.log(`Listening on port ${port}!`));
