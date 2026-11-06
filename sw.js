// Offline cache so the app opens without internet. Network first, cache as fallback.
const CACHE = 'savewise-v6';
const FILES = [
  './', 'index.html', 'intro.html', 'intro2.html', 'intro3.html', 'login.html', 'signup.html',
  'home.html', 'expenses.html', 'goals.html', 'needwant.html', 'later.html', 'challenges.html',
  'reports.html', 'profile.html', 'css/styles.css', 'js/core.js', 'js/splash.js', 'js/intro.js',
  'js/login.js', 'js/signup.js', 'js/home.js', 'js/expenses.js', 'js/goals.js', 'js/needwant.js',
  'js/later.js', 'js/challenges.js', 'js/reports.js', 'js/profile.js', 'manifest.webmanifest', 'icon.svg',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-192.png', 'icons/maskable-512.png',
  'images/logo-white.png', 'images/logo-red.png', 'images/logo-dark.png', 'images/intro-1.png', 'images/intro-2.png', 'images/intro-3.png', 'images/goals-pig.png',
  'images/expenses-pig.png', 'images/needwant-pig.png', 'images/later-pig.png', 'images/challenges-pig.png', 'images/ticket-bg.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE).map((x) => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html')))
  );
});
