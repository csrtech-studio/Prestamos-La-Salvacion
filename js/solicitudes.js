import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

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

// Función para obtener solicitudes y mostrarlas en la tabla
const loanTableBody = document.getElementById('loanTableBody');
const loansRef = ref(database, 'prestamos/');

onValue(loansRef, (snapshot) => {
    loanTableBody.innerHTML = ''; // Limpiar tabla antes de mostrar datos
    snapshot.forEach((childSnapshot) => {
        const loanData = childSnapshot.val();
        const loanId = childSnapshot.key;
        const estatus = loanData.estatus || 'En revisión'; // Valor por defecto

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="detalles.html?id=${loanId}" class="nombre-link">${loanData.nombre}</a></td>
            <td>${loanData.monto}</td>
            <td>${loanData.fecha}</td>
            <td class="estatus">${estatus}</td>
            <td>
                <button class="btn-aceptar" data-id="${loanId}" data-telefono="${loanData.telefono}" ${estatus !== 'En revisión' ? 'disabled' : ''}>Aceptar</button>
                <button class="btn-rechazar" data-id="${loanId}" data-telefono="${loanData.telefono}" ${estatus !== 'En revisión' ? 'disabled' : ''}>Rechazar</button>
            </td>
        `;
        loanTableBody.appendChild(row);
    });

    // Añadir eventos a los botones (aceptar/rechazar)
    const aceptarButtons = document.querySelectorAll('.btn-aceptar');
    aceptarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const loanId = button.getAttribute('data-id');
            actualizarEstatus(loanId, 'Aprobado');
        });
    });

    const rechazarButtons = document.querySelectorAll('.btn-rechazar');
    rechazarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const loanId = button.getAttribute('data-id');
            actualizarEstatus(loanId, 'Rechazado');
        });
    });
});

// Función para actualizar el estado del préstamo
function actualizarEstatus(loanId, nuevoEstatus) {
    const loanRef = ref(database, `prestamos/${loanId}`);
    update(loanRef, { estatus: nuevoEstatus })
        .then(() => {
            console.log(`Estado del préstamo ${loanId} actualizado a ${nuevoEstatus}`);
        })
        .catch((error) => {
            console.error("Error al actualizar el estado del préstamo: ", error);
        });
}
