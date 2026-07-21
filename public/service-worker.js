self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      if (event.request.mode === "navigate") {
        return caches.match("/game.html");
      }

      return Response.error();
    })
  );
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("offline-v1").then((cache) => {
      return cache.addAll([
        "/game.html",
      ]);
    })
  );
});