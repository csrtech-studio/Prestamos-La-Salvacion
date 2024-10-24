const VERSION = "v01";
const CACHE_NAME = `Prestamos-La-Salvacion-${VERSION}`;
const appshell = [
  '/Prestamos-La-Salvacion/',
  '/Prestamos-La-Salvacion/index.html',
  '/Prestamos-La-Salvacion/details.html',
  '/Prestamos-La-Salvacion/forgot_password.html',
  '/Prestamos-La-Salvacion/login.html',
  '/Prestamos-La-Salvacion/paid_loans.html',
  '/Prestamos-La-Salvacion/solicitar_prestamo.html',
  '/Prestamos-La-Salvacion/solicitudes.html',
  '/Prestamos-La-Salvacion/css/styles.css',
  '/Prestamos-La-Salvacion/image/logo.png',
  '/Prestamos-La-Salvacion/image/icons/favicon.ico',
  '/Prestamos-La-Salvacion/js/details.js',
  '/Prestamos-La-Salvacion/js/firebaseConfig.js',
  '/Prestamos-La-Salvacion/js/forgot_password_script.js',
  '/Prestamos-La-Salvacion/js/login_script.js',
  '/Prestamos-La-Salvacion/js/paid_loans_script.js',
  '/Prestamos-La-Salvacion/js/script.js',
  '/Prestamos-La-Salvacion/js/solicitar_prestamo.js',
  '/Prestamos-La-Salvacion/js/register-sw.js',
  '/Prestamos-La-Salvacion/js/install_pwa.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache opened');
      return cache.addAll(appshell);
    }).catch(err => console.error('Failed to open cache: ', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Old cache deleted:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
