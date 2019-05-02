import NewsAPI from 'newsapi';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import sharp from 'sharp';
import util from 'util';
import stream from 'stream';
import { notifyAll } from './subscriptions';

const pipeline = util.promisify(stream.pipeline);

const apiKey = process.env.NEWSAPI__API_KEY;
const newsapi = new NewsAPI(apiKey);

// Developer licence includes up to 500/day.
const updatesPerDay = 450;

const fetchArticles = async (cacheArticles) => {
  if (cacheArticles) {
    try {
      return JSON.parse(fs.readFileSync('articles.json', 'utf-8'));
    } catch (ignored) {}
  }

  const articles = await newsapi.v2.topHeadlines({
    language: 'en',
  });

  if (cacheArticles) {
    fs.writeFileSync('articles.json', JSON.stringify(articles));
  }

  return articles;
};

let cached = null;

const articleExists = (article) => cached.find(c => c.title === article.title);

const statics = path.resolve(__dirname, '../../../public');
fs.mkdirSync(path.resolve(statics, 'img'), { recursive: true });

const fetchAndStoreImage = async (url, id) => {
  console.log('fetching', url);
  const filePath = `/img/${id}.png`;
  const res = await fetch(url);
  const dest = fs.createWriteStream(path.resolve(statics, `.${filePath}`));
  const transform = sharp().toFormat('png').resize(100, 100);

  await pipeline(
    res.body,
    transform,
    dest,
  );

  return filePath;
};

const addNewArticle = async (article) => {
  if (!cached) cached = [];
  if (articleExists(article)) return null;

  // TODO: find better id
  const id = cached.length;

  if (!article.urlToImage) {
    article.urlToImage = '/img/icon.png';
  } else {
    try {
      article.urlToImage = await fetchAndStoreImage(article.urlToImage, id);
    } catch (error) {
      console.log('error fetching image', error && error.message || error);
      article.urlToImage = '/img/icon.png';
    }
  }

  const data = {
    id,
    title: article.title,
    description: article.description,
    iconUrl: article.urlToImage,
    timestamp: article.publishedAt,
  };

  cached.unshift(data);
  return data;
};

const fetchAndAddArticles = async () => {
  const result = await fetchArticles(false);
  const added = [];
  for (let article of result.articles.reverse()) {
    added.push(await addNewArticle(article));
  }
  return added.filter(Boolean);
};

export const getNews = async () => {
  if (!cached) await fetchAndAddArticles();
  return cached;
};

const updateInterval = 24*60*60*1000 / updatesPerDay;
const updateNews = async () => {
  try {
    if (!cached) {
      await getNews();
    } else {
      const newArticles = await fetchAndAddArticles();
      console.log(`Updated articles, got ${newArticles.length} new ones!`);
      await Promise.all(newArticles.map(notifyAll));
      console.log('Notified all users.');
    }
  } catch (error) {
    console.error(error && error.message || error);
  }

  setTimeout(updateNews, updateInterval);
};

setTimeout(updateNews, updateInterval);

updateNews();