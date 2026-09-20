const CACHE="task-sorter-full-v1";
const PAGE="./offline-calc.html";

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE).then(cache=>cache.add(PAGE))
  );
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;

  if(event.request.mode==="navigate"){
    event.respondWith(
      fetch(event.request).then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(PAGE,copy));
        return response;
      }).catch(()=>caches.match(PAGE))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached=>cached||fetch(event.request))
  );
});