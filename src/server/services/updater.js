import { CronJob } from 'cron';
import { fetchArticles } from './news';
import { insertNews } from './db';

const updateNews = async () => {
  console.log('Updating news..');
  const articles = await fetchArticles();
  await insertNews(articles);
  console.log('Update done.');
};

export const scheduleUpdates = () => new CronJob('*/15 * * * *', updateNews).start();

if (process.env.NODE_ENV === 'development') {
  updateNews().then(() => {
    console.log('Server ready!');
  }).catch((error) => {
    console.log(error && error.message || error);
  });
}
