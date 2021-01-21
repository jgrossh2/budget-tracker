const APP_PREFIX = 'Budget-Tracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/idb.js",
    "./js/index.js",
    "./manifest.json",
    "./icons/icon-72x72.png",
    "./icons/icon-96x96.png",
    "./icons/icon-128x128.png",
    "./icons/icon-144x144.png",
    "./icons/icon-152x152.png",
    "./icons/icon-192x192.png",
    "./icons/icon-384x384.png",
    "./icons/icon-512x512.png",
];
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })
            cacheKeepList.push(CACHE_NAME);

            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeepList.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i] );
                    return caches.delete(keyList[i]);
                }
            }))
        })
    )
});
self.addEventListener('activate', function (e) {
    e.waitUntil(
        // .keys() returns array of all cache names
        // keyList is parameter that contains all cache names under <>.github.io
      caches.keys().then(function (keyList) {
        let cacheKeeplist = keyList.filter(function (key) {
            // APP_PREFIX saves app prefix 
          return key.indexOf(APP_PREFIX);
        })
        cacheKeeplist.push(CACHE_NAME);

        return Promise.all(keyList.map(function (key, i) {
            // only returns value of -1 if item not found in keylist
            if (cacheKeeplist.indexOf(key) === -1) {
              console.log('deleting cache : ' + keyList[i] );
            //   if key isn't found in keylist, delete from cache list
              return caches.delete(keyList[i]);
            }
          })
          );
      })
    );
});
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                // if cache is available, respond with cache
              console.log('responding with cache : ' + e.request.url)
              return request
            } else { 
                // if there are no cache, try fetching request
              console.log('file is not cached, fetching : ' + e.request.url)
              return fetch(e.request)
          }
          
          // You can omit if/else for console.log & put one line below like this too.
          // return request || fetch(e.request)
          })
    )
  })