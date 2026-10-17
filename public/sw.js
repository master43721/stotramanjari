/**
 * Stotramani Offline Service Worker
 * Ensures devotees can chant and read stotras inside puja rooms or temples without cellular connectivity.
 */

const CACHE_NAME = "stotramani-v4";

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

  const url = new URL(request.url);

  // Never cache third-party requests or API responses. In particular, this
  // prevents a stale Panchang response or analytics request being replayed.
  if (url.origin !== self.location.origin || url.pathname.startsWith(`${BASE_PATH}/api/`)) {
    return;
  }

  // Prefer the current network version. The previous cache-first strategy
  // could keep old HTML/CSS/font references alive after a deployment, which
  // is especially visible as missing Telugu glyphs on mobile browsers.
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(async () => (await cache.match(request)) || Response.error());
    })
  );
});
