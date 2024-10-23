import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";

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
const storage = getStorage(app);

// Obtener el ID del préstamo desde la URL
const urlParams = new URLSearchParams(window.location.search);
const loanId = urlParams.get('id');

// Referencia a los datos del préstamo específico
const loanRef = ref(database, `prestamos/${loanId}`);

get(loanRef).then((snapshot) => {
    if (snapshot.exists()) {
        const loanData = snapshot.val();
        document.getElementById('nombre').textContent = loanData.nombre;
        document.getElementById('direccion').textContent = loanData.direccion;
        document.getElementById('telefono').textContent = loanData.telefono;
        document.getElementById('monto').textContent = loanData.monto;
        document.getElementById('fecha').textContent = loanData.fecha;
        document.getElementById('estatus').textContent = loanData.estatus || 'En revisión';

        // Obtener la URL de la imagen de la INE
        if (loanData.ineUrl) { // Verifica si existe la URL en la base de datos
            const ineImageRef = storageRef(storage, loanData.ineUrl);
            getDownloadURL(ineImageRef).then((url) => {
                // Asignar la URL al elemento de imagen
                document.getElementById('ine-image').src = url;
            }).catch((error) => {
                console.error('Error al obtener la URL de la INE:', error);
            });
        }
    } else {
        alert('No se encontraron detalles del préstamo.');
    }
}).catch((error) => {
    console.error('Error al obtener los datos:', error);
});