import NewsAPI from 'newsapi';

const apiKey = process.env['NEWSAPI__API_KEY'];
const newsapi = new NewsAPI(apiKey);

export const getNews = async () => {
  const result = await newsapi.v2.topHeadlines({
    language: 'en',
  });

  // TODO: create unique ID and fetch urlToImage

  return result.articles.map(article => ({
    title: article.title,
    description: article.description,
    iconUrl: article.urlToImage,
    timestamp: article.publishedAt,
  }));
};
