console.log('Hello from SW!');

self.addEventListener('push', ev => {
  const data = ev.data.json();
  console.log('Got push', data);
  self.registration.showNotification(data.title, {
    body: data.description,
    icon: data.iconUrl,
  });
});
