// Notification Service Worker
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Listen for scheduled notification messages
self.addEventListener('message', e => {
  if (e.data?.type === 'SCHEDULE_NOTIFICATIONS') {
    // Store schedules in SW cache
    self.notificationSchedules = e.data.schedules;
  }
});

// Check every minute if any notification should fire
self.addEventListener('periodicsync', e => {
  if (e.tag === 'check-notifications') {
    e.waitUntil(checkAndNotify());
  }
});

async function checkAndNotify() {
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const schedules = self.notificationSchedules || [];
  for (const s of schedules) {
    if (s.time === hhmm && s.enabled) {
      await self.registration.showNotification(s.title || '루틴 알림', {
        body: s.body || '루틴을 확인해요!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: s.id,
        renotify: true,
        data: { url: '/' },
      });
    }
  }
}

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      if (clients.length > 0) return clients[0].focus();
      return self.clients.openWindow('/');
    })
  );
});
