import webpush from 'web-push';

const vapidKeys = {
  publicKey: process.env.WEBPUSH__PUBLIC_KEY,
  privateKey: process.env.WEBPUSH__PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:richard@rknoll.at',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// TODO: persist this in a database
let subscriptions = [];

const compareSubscriptions = (a, b) => {
  if (!a.keys || !b.keys) throw new Error('Expected subscriptions with keys');
  return a.endpoint === b.endpoint && a.keys.auth === b.keys.auth && a.keys.p256dh === b.keys.p256dh;
};

export const removeSubscription = async (subscription) => {
  subscriptions = subscriptions.filter(s => !compareSubscriptions(s, subscription));
};

export const addSubscription = async (subscription) => {
  await removeSubscription(subscription);
  subscriptions.push(subscription)
};

export const notifyAll = (data) => {
  console.log(`Notifying ${subscriptions.length} users..`);
  return Promise.all(subscriptions.map(async (subscription) => {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(data));
    } catch (error) {
      console.error('Error in subscription', error && error.message || error);
      await removeSubscription(subscription);
    }
  }));
};
