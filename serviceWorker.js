const VERSION = "v01";
const CACHE_NAME = `prestamos-la-salvacion ${VERSION}`;
const appshell = [
    '/prestamos-la-salvacion/',
    '/prestamos-la-salvacion/index.html',
    '/prestamos-la-salvacion/details.html',
    '/prestamos-la-salvacion/forgot_password.html',
    '/prestamos-la-salvacion/login.html',
    '/prestamos-la-salvacion/paid_loans.html',
    '/prestamos-la-salvacion/solicitar_prestamo.html',
    '/prestamos-la-salvacion/solicitudes.html',
    '/prestamos-la-salvacion/css/style.css',
    '/prestamos-la-salvacion/css/style_log.css',
    '/prestamos-la-salvacion/image/logo.png',
    '/prestamos-la-salvacion/image/icons/favicon.ico',
    '/prestamos-la-salvacion/js/details.js',
    '/prestamos-la-salvacion/js/firebaseConfig.js',
    '/prestamos-la-salvacion/js/forgot_password_script.js',
    '/prestamos-la-salvacion/js/login_script.js',
    '/prestamos-la-salvacion/js/paid_loans_script.js',
    '/prestamos-la-salvacion/js/script.js',
    '/prestamos-la-salvacion/js/solicitar_prestamo.js',
    '/prestamos-la-salvacion/js/solicitar_prestamo.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache opened');
                return cache.addAll(appshell);
            })
            .catch(err => console.error('Failed to open cache: ', err))
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