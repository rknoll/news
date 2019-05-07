import { openDB } from 'idb';

const database = 'news';
const collection = 'news';

const open = () => openDB(database, 1, {
  upgrade(db) {
    console.log('Creating database!');
    try {
      db.createObjectStore(collection, {keyPath: 'id'});
    } catch (e) {

    }
  },
});

export const add = async (item) => {
  const db = await open();
  return db.put(collection, item);
};

export const getAll = async () => {
  const db = await open();
  return db.getAll(collection);
};
