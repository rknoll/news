import NewsAPI from 'newsapi';
import { notifyAll } from './subscriptions';

const apiKey = process.env.NEWSAPI__API_KEY;
const newsapi = new NewsAPI(apiKey);

// Developer licence includes up to 500/day.
const updatesPerDay = 450;

let cached = null;

const fetchArticles = () => newsapi.v2.topHeadlines({
  language: 'en',
});

const convertToArticle = (article) => ({
  id: cached.length,
  title: article.title,
  description: article.description,
  iconUrl: article.urlToImage,
  timestamp: article.publishedAt,
});

export const getNews = async () => {
  if (!cached) {
    const result = await fetchArticles();

    // TODO: create unique ID and fetch urlToImage
    cached = [];
    result.articles.forEach(article => {
      cached.push(convertToArticle(article));
    });
  }

  return cached;
};

const hasTitle = (title) => cached.find(c => c.title === title);

const updateInterval = 24*60*60*1000 / updatesPerDay;
const updateNews = async () => {
  try {
    if (!cached) {
      await getNews();
    } else {
      const result = await fetchArticles();
      const newArticles = [];

      result.articles.forEach(article => {
        if (!hasTitle(article.title)) {
          const data = convertToArticle(article);
          newArticles.push(data);
          cached.unshift(data);
        }
      });

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
