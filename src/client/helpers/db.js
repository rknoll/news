import { openDB } from 'idb';

const database = 'news';
const collection = 'news';

const open = () => openDB(database, 1, {
  upgrade(db) {
    db.createObjectStore(collection, {keyPath: 'id'});
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

export const clear = async () => {
  const db = await open();
  return db.clear(collection);
};

export default {
  add,
  getAll,
  clear,
};
