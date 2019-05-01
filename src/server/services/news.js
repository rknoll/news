import NewsAPI from 'newsapi';

const apiKey = process.env.NEWSAPI__API_KEY;
const newsapi = new NewsAPI(apiKey);

let cached = null;

const fetchArticles = () => newsapi.v2.topHeadlines({
  language: 'en',
});

export const getNews = async () => {
  if (!cached) {
    const result = await fetchArticles();

    // TODO: create unique ID and fetch urlToImage

    cached = result.articles.map((article, index) => ({
      id: index,
      title: article.title,
      description: article.description,
      iconUrl: article.urlToImage,
      timestamp: article.publishedAt,
    }));
  }

  return cached;
};
