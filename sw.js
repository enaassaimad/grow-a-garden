// A more robust service worker to handle offline functionality and cross-origin assets.

const CACHE_NAME = 'grow-garden-companion-v1.5'; // Incremented cache version

// Updated list of assets to ensure everything exists and is needed.
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/adConfig.ts',
  '/manifest.json',
  '/assets/icon.svg',
  '/hooks/useTheme.tsx',
  '/hooks/useLocalization.tsx',
  '/hooks/useAdMob.tsx',
  '/hooks/useFavorites.tsx',
  '/hooks/usePlanner.tsx',
  '/components/BottomNav.tsx',
  '/components/Icons.tsx',
  '/components/Modal.tsx',
  '/components/MarkdownRenderer.tsx',
  '/components/NativeAd.tsx',
  '/components/AdMock.tsx',
  '/pages/HomePage.tsx',
  '/pages/PetsPage.tsx',
  '/pages/PetDetailPage.tsx',
  '/pages/CropsPage.tsx',
  '/pages/CropDetailPage.tsx',
  '/pages/PlannerPage.tsx',
  '/pages/GuidesPage.tsx',
  '/pages/GuideDetailPage.tsx',
  '/pages/SettingsPage.tsx',
  '/data/pets.ts',
  '/data/crops.ts',
  '/data/guides.ts',
  '/utils/dateUtils.ts',
  '/utils/cropUtils.ts',
  '/locales/en.json',
  '/locales/fr.json',
  '/locales/ar.json',
  '/locales/es.json',
  '/locales/zh.json',
  '/locales/ru.json',
  '/locales/de.json',
  // CDN Assets (Cross-Origin)
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/client',
  'https://aistudiocdn.com/react-router-dom@^7.9.1',
  'https://aistudiocdn.com/@google/genai@^1.20.0'
];

// Install event: Caches all the app shell assets.
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    console.log('Service Worker: Caching app shell');
    
    // Use addAll for same-origin assets for efficiency
    const sameOriginAssets = ASSETS_TO_CACHE.filter(url => !url.startsWith('http'));
    cache.addAll(sameOriginAssets);

    // Handle cross-origin assets separately
    const crossOriginAssets = ASSETS_TO_CACHE.filter(url => url.startsWith('http'));
    for (const assetUrl of crossOriginAssets) {
        try {
            const request = new Request(assetUrl, { mode: 'no-cors' });
            await cache.add(request);
        } catch (error) {
            console.warn(`Service Worker: Failed to cache cross-origin asset ${assetUrl}.`, error);
        }
    }
  })());
});


// Activate event: Cleans up old caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Fetch event: Serves assets from cache first (Cache-First strategy).
self.addEventListener('fetch', (event) => {
  // FIX: Ignore requests that are not http/https to prevent errors with browser extensions.
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  // Ignore non-GET requests and ads.
  if (event.request.method !== 'GET' || event.request.url.includes('pagead2.googlesyndication.com')) {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    
    // 1. Try to get the response from the cache.
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 2. If not in cache, fetch from the network.
    try {
      const networkResponse = await fetch(event.request);
      
      // 3. Cache the new response for future use.
      // This handles same-origin and opaque (cross-origin no-cors) responses.
      if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
        const responseToCache = networkResponse.clone();
        await cache.put(event.request, responseToCache);
      }
      
      return networkResponse;
    } catch (error) {
      // Fetch failed, likely due to being offline.
      console.error('Service Worker: Network fetch failed.', error);
      // Optional: Return a custom offline fallback page if you have one.
      // return caches.match('/offline.html');
    }
  })());
});