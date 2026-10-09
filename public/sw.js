// Minimal service worker: it exists so browsers treat the site as installable.
// It caches nothing, so your data is always loaded fresh.
const OFFLINE_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Offline</title>
<style>
  body { font-family: system-ui, sans-serif; background: #eef1f6; color: #1b2433;
         display: grid; place-items: center; min-height: 100vh; margin: 0; text-align: center; padding: 1rem; }
  p { color: #5b6678; }
</style>
</head>
<body>
  <main>
    <h1>You're offline</h1>
    <p>Reconnect to the internet and reopen the app.</p>
  </main>
</body>
</html>`;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim()),
);

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return; // only page loads, never data
  event.respondWith(
    fetch(event.request).catch(
      () =>
        new Response(OFFLINE_PAGE, {
          status: 503,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    ),
  );
});
