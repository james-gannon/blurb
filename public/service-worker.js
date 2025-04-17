// Service worker for Blurb PWA
const CACHE_NAME = 'blurb-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/inbox.html',
  '/onboarding.html',
  // Add CSS and JS files as needed
];

// Install event - cache essential resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return response from cache if available
        if (response) {
          return response;
        }
        
        // Otherwise, fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache non-GET requests or non-success responses
            if (!response || response.status !== 200 || event.request.method !== 'GET') {
              return response;
            }

            // Clone the response to store in cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  const data = event.data.json();
  
  // Show notification when push received
  const options = {
    body: data.message || 'New call summary available',
    icon: '/assets/icon-192.png',
    badge: '/assets/badge-96.png',
    data: {
      url: data.url || '/inbox.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification('Blurb', options)
  );
});

// Notification click event - open the app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});