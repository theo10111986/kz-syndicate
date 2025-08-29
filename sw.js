// public/sw.js
const CACHE_NAME = "kzsyndicate-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Online-first: αν πέσει το δίκτυο, γύρνα σε cache
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const res = await fetch(req);
        if (res && res.status === 200 && new URL(req.url).origin === self.location.origin) {
          cache.put(req, res.clone());
        }
        return res;
      } catch {
        const cached = await cache.match(req);
        if (cached) return cached;
        throw new Error("Offline and not cached");
      }
    })()
  );
});
