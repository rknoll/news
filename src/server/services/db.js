import { MongoClient, ObjectID } from 'mongodb';
import { Base64Decode } from 'base64-stream';

const username = encodeURIComponent(process.env.MONGODB__USERNAME);
const password = encodeURIComponent(process.env.MONGODB__PASSWORD);
const database = 'news';

const url = `mongodb://${username}:${password}@192.168.10.6:27017/${database}`;

const connect = async () => {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  return client;
};

export const insertNews = async (news) => {
  const client = await connect();
  try {
    const collection = client.db(database).collection('news');
    const newsTitles = news.map(n => n.title);
    const existing = await collection.find({
      title: { $in: newsTitles }
    }).project({ title: 1 }).toArray();
    const existingTitles = new Set(existing.map(n => n.title));
    const newNews = news.filter(n => !existingTitles.has(n.title));
    if (!newNews.length) {
      console.log('No new news inserted.');
      return;
    }
    const result = await collection.insertMany(newNews);
    console.log(`Inserted ${result.insertedCount} news.`);
  } finally {
    client.close();
  }
};

export const getNews = async (id) => {
  const client = await connect();
  try {
    const collection = client.db(database).collection('news');
    const data = await collection
      .find({ _id: new ObjectID(id) })
      .project({ image: 0 })
      .toArray();
    if (data.length !== 1) throw new Error(`Could not find news with id ${id}.`);
    return data[0];
  } finally {
    client.close();
  }
};

export const getNewsImage = async (id) => {
  const client = await connect();
  try {
    const collection = client.db(database).collection('news');
    const data = await collection
      .find({ _id: new ObjectID(id) })
      .project({ image: 1, _id: 0 })
      .toArray();
    if (data.length !== 1) throw new Error(`Could not find news image with id ${id}.`);
    const decoder = new Base64Decode();
    decoder.write(data[0].image);
    decoder.end();
    return decoder.read();
  } finally {
    client.close();
  }
};

export const getRandomNews = async () => {
  const client = await connect();
  try {
    const collection = client.db(database).collection('news');
    const data = await collection
      .aggregate([{ $sample: { size: 1 } }])
      .project({ image: 0 })
      .toArray();
    if (data.length !== 1) throw new Error(`Could not find any news.`);
    return data[0];
  } finally {
    client.close();
  }
};
