/**
 * Stotramani Offline Service Worker
 * Ensures devotees can chant and read stotras inside puja rooms or temples without cellular connectivity.
 */

const CACHE_NAME = "stotramani-v2";

// Resolve scope/base path dynamically so sw works seamlessly on root domain stotramani.app
const scopeUrl = new URL(self.registration.scope);
const scopePath = scopeUrl.pathname.endsWith("/") ? scopeUrl.pathname.slice(0, -1) : scopeUrl.pathname;
const BASE_PATH = scopePath || "";

// Core assets to pre-cache on install
const PRECACHE_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/icon.svg`,
  `${BASE_PATH}/icon-192.png`,
  `${BASE_PATH}/icon-512.png`,
  `${BASE_PATH}/manifest.webmanifest`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("Pre-cache items skipped or failed:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Stale-While-Revalidate caching strategy for stotram pages and resources
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && request.url.startsWith("http")) {
              // Cache a copy of the response for offline reading
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failed - return cached response if available
            return cachedResponse;
          });

        // Return cached immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      });
    })
  );
});
