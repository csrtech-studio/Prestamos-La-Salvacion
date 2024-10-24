import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB2P22lorgeiQjHgnvMcguBiP4U9PZUYZs",
    authDomain: "prestamos-la-salvacion.firebaseapp.com",
    databaseURL: "https://prestamos-la-salvacion-default-rtdb.firebaseio.com/",
    projectId: "prestamos-la-salvacion",
    storageBucket: "prestamos-la-salvacion.appspot.com",
    messagingSenderId: "326817496328",
    appId: "1:326817496328:web:6854959ede4e0a0f8700bd"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Referencia a la colección de préstamos
const loansRef = ref(database, 'prestamos/');

// Función para verificar nuevas solicitudes
onValue(loansRef, (snapshot) => {
    let newRequests = 0;

    snapshot.forEach((childSnapshot) => {
        const loanData = childSnapshot.val();
        const estatus = loanData.estatus || 'En revisión'; // Valor por defecto

        // Contar solicitudes en revisión
        if (estatus === 'En revisión') {
            newRequests++;
        }
    });

    const notification = document.getElementById('notification');
    if (newRequests > 0) {
        notification.style.display = 'block'; // Mostrar notificación si hay nuevas solicitudes
    } else {
        notification.style.display = 'none'; // Ocultar notificación si no hay nuevas
    }
});
