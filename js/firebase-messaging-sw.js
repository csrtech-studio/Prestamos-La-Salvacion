importScripts('https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.16.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyB2P22lorgeiQjHgnvMcguBiP4U9PZUYZs",
    authDomain: "prestamos-la-salvacion.firebaseapp.com",
    databaseURL: "https://prestamos-la-salvacion-default-rtdb.firebaseio.com/",
    projectId: "prestamos-la-salvacion",
    storageBucket: "prestamos-la-salvacion.appspot.com",
    messagingSenderId: "326817496328",
    appId: "1:326817496328:web:6854959ede4e0a0f8700bd"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Manejar el evento de fondo
messaging.onBackgroundMessage((payload) => {
    console.log('Mensaje de fondo recibido: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    // Muestra la notificación
    self.registration.showNotification(notificationTitle, notificationOptions);
});
