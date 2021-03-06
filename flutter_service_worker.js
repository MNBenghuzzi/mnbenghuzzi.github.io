'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "apple-touch-icon.png": "49be87cdf673a34f6a3a06f2b2dff80e",
"assets/AssetManifest.json": "427ec9a58da228fd8da33b82924a3d02",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/google_fonts/Poppins-Black.ttf": "0573b9231a8316427ad6e751b52e87a4",
"assets/google_fonts/Poppins-Bold.ttf": "a3e0b5f427803a187c1b62c5919196aa",
"assets/google_fonts/Poppins-ExtraBold.ttf": "544fa4f2678a8285eb88b8dfe503c90c",
"assets/google_fonts/Poppins-ExtraLight.ttf": "86a2f13e91ac85080ebaeaab9463b9f1",
"assets/google_fonts/Poppins-Light.ttf": "f6ea751e936ade6edcd03a26b8153b4a",
"assets/google_fonts/Poppins-Medium.ttf": "f61a4eb27371b7453bf5b12ab3648b9e",
"assets/google_fonts/Poppins-Regular.ttf": "8b6af8e5e8324edfd77af8b3b35d7f9c",
"assets/google_fonts/Poppins-SemiBold.ttf": "4cdacb8f89d588d69e8570edcbe49507",
"assets/google_fonts/Poppins-Thin.ttf": "25cd0f688f815bc4f6ac2b71eb6278ba",
"assets/lib/assets/dev.png": "1e827d41cdcb4215f0f8b52bf520ee4c",
"assets/lib/assets/firebase.svg": "6caacd1ac451f5d5c012ebabcb25d071",
"assets/lib/assets/github.svg": "0255bf2cd6e42c2fdbe2e189e418929f",
"assets/lib/assets/netlify.svg": "41555d529c6dac488b4292fe55632cad",
"assets/lib/assets/newpic.png": "1f16c5a14c8ac58fb20718e512719cde",
"assets/lib/assets/waving_hand.riv": "c9e4e0a44db651aa525e3706fe812ad3",
"assets/NOTICES": "19e9c49e365d46042d2f1aa41d9225eb",
"favicon-16x16.png": "236b145bd23b9242960aa9caa8a63da1",
"favicon-32x32.png": "655fc8956b86e63a10a3049e719c1645",
"favicon.ico": "cd789b08d3e3b77c4eca73f93361304d",
"icons/maskable_icon_x128.png": "881e31018c295ad5cf34168bb0fd8f5b",
"icons/maskable_icon_x144.png": "fb65127aa46bb68fcb599f8467a2381c",
"icons/maskable_icon_x192.png": "93a449d21121bc1cef1654b570bbd191",
"icons/maskable_icon_x384.png": "1f2478d4295db49681fbd956e499c7fd",
"icons/maskable_icon_x48.png": "a44b146fc3a0ce74c9592e6c4bc0d72a",
"icons/maskable_icon_x512.png": "2155c3a1b7ec96c1ca5cf39282ea98a8",
"icons/maskable_icon_x72.png": "e8cfb0686775eaefedd0091e40c149fa",
"icons/maskable_icon_x96.png": "d191cce014f54a8a86c964109e6315b5",
"index.html": "468ee4d7d1f22ff235c73b3ab0baac65",
"/": "468ee4d7d1f22ff235c73b3ab0baac65",
"main.dart.js": "810dc78f53156c0a2d23390f02a8446d",
"manifest.json": "ec7efa34cbe8670ad5c0d3278d38e31a",
"splash/launch-1125x2436.png": "e03cbf07bbadb5ac3e0f670a6252a22b",
"splash/launch-1242x2208.png": "c569fe802950d00924ac66ac387118a4",
"splash/launch-1536x2048.png": "98552f1655a137f7585d143abaa3198a",
"splash/launch-1668x2224.png": "96c35e4443a041c7f62c6300047a6f95",
"splash/launch-2048x2732.png": "2d4c10ec9cf1a8eb7b2c22a4b409b857",
"splash/launch-640x1136.png": "8c76a715ffcac2c280230c7480332a89",
"splash/launch-750x1334.png": "e13e3ee26e02989a6b945f9f45b4c605",
"styles.css": "140b5d8a8b3b357e033658120bbd6727",
"version.json": "67326c20d699006c6d2cfebe0eb4eb01"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
