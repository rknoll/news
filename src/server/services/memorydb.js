import { ObjectID } from 'mongodb';
const storage = [];
const idOffset = new Date().valueOf();

class Collection {
  constructor(store) { this.store = store; }
  find(query) { this.query = query; return this; }
  aggregate() { this.random = true; return this; }
  project({ image }) { this.image = image; return this; }

  insertMany(entries) {
    const getId = (index) => new ObjectID(`${this.store.length + index + idOffset}`.padStart(24, '0'));
    this.store.push(...entries.map((entry, index) => ({...entry, _id: getId(index)})));
    return { insertedCount: entries.length };
  }

  toArray() {
    let result = [];
    if (this.query) {
      if (this.query._id) {
        result = this.store.filter(entry => entry._id.equals(this.query._id));
      } else {
        result = this.store.filter(entry => this.query.title['$in'].includes(entry.title));
      }
    } else if (this.random) {
      result = this.store.length ? [this.store[Math.floor(this.store.length * Math.random())]] : [];
    } else {
      result = this.store;
    }
    return result.map(({ image, ...entry }) => this.image ? { image } : entry);
  }
}

export default {
  db: () => ({ collection: () => new Collection(storage) }),
  close: () => {},
};
