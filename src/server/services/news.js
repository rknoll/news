import NewsAPI from 'newsapi';
import fetch from 'node-fetch';
import sharp from 'sharp';
import util from 'util';
import stream from 'stream';
import concat from 'concat-stream';
import { Base64Encode } from 'base64-stream';

const newsapi = new NewsAPI(process.env.NEWSAPI__API_KEY);
const pipeline = util.promisify(stream.pipeline);

const fetchImage = async (article) => {
  try {
    const {urlToImage, ...result} = article;
    const response = await fetch(urlToImage);
    await pipeline(
      response.body,
      sharp().toFormat('png').resize(100, 100),
      new Base64Encode(),
      concat(image => result.image = image)
    );
    return result;
  } catch (error) {
    console.error('Error while fetching image', error);
    return null;
  }
};

export const fetchArticles = async () => {
  const { articles } = await newsapi.v2.topHeadlines({
    language: 'en',
  });
  console.log(`Fetched ${articles.length} news.`);
  const validArticles = articles.filter(article => article.urlToImage && article.title && article.description && article.publishedAt);
  const articlesWithImages = await Promise.all(validArticles.map(fetchImage));
  return articlesWithImages.filter(Boolean).map(article => ({
    title: article.title,
    description: article.description,
    image: article.image,
    timestamp: article.publishedAt,
  }));
};
