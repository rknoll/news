import webpush from 'web-push';

const vapidKeys = {
  publicKey: process.env.WEBPUSH__PUBLIC_KEY,
  privateKey: process.env.WEBPUSH__PRIVATE_KEY
};

const options = {
  headers: {
    'Urgency': 'high',
  },
};

try {
  webpush.setVapidDetails(
    'mailto:richard@rknoll.at',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
} catch (e) {
  console.error(e);
}

export const notify = async (subscription, data) => {
  console.log('Notifying..');
  try {
    await webpush.sendNotification(subscription, JSON.stringify(data), options);
    console.log('Notify done.');
    return true;
  } catch (error) {
    console.error('Error notifying:', error && error.message || error);
  }
  return false;
};
