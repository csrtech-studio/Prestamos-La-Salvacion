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
    agregarEventosBotones();
});

// Función para agregar eventos a los botones
function agregarEventosBotones() {
    const aceptarButtons = document.querySelectorAll('.btn-aceptar');
    aceptarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const loanId = button.getAttribute('data-id');
            const telefono = button.getAttribute('data-telefono');
            console.log('Aceptar botón presionado para préstamo:', loanId, 'Teléfono:', telefono); // Mensaje de depuración
            actualizarEstatus(loanId, 'Aprobado', telefono);
        });
    });

    const rechazarButtons = document.querySelectorAll('.btn-rechazar');
    rechazarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const loanId = button.getAttribute('data-id');
            const telefono = button.getAttribute('data-telefono');
            console.log('Rechazar botón presionado para préstamo:', loanId, 'Teléfono:', telefono); // Mensaje de depuración
            actualizarEstatus(loanId, 'Rechazado', telefono);
        });
    });
}

// Función para actualizar el estado del préstamo y abrir WhatsApp
function actualizarEstatus(loanId, nuevoEstatus, telefono) {
    const loanRef = ref(database, `prestamos/${loanId}`);
    update(loanRef, { estatus: nuevoEstatus })
        .then(() => {
            console.log(`Estado del préstamo ${loanId} actualizado a ${nuevoEstatus}`);

            // Mensajes según el estatus
            let mensaje;
            if (nuevoEstatus === 'Aprobado') {
                mensaje = encodeURIComponent(
                    `Estimado cliente, su préstamo ha sido aprobado. Por favor, proporcione su número de tarjeta. El monto será depositado en un lapso de 2 horas. Agradecemos su confianza en nosotros.`
                );
            } else {
                mensaje = encodeURIComponent(
                    `Estimado cliente, lamentamos informarle que su solicitud de préstamo ha sido rechazada. Le pedimos disculpas por los inconvenientes y le sugerimos que lo intente nuevamente más adelante. Agradecemos su comprensión.`
                );
            }

            const urlWhatsApp = `https://wa.me/${telefono}?text=${mensaje}`;
            console.log('Abrir WhatsApp con URL:', urlWhatsApp); // Mensaje de depuración
            window.open(urlWhatsApp, '_blank');

            // Desaparecer los botones
            ocultarBotones(loanId);
        })
        .catch((error) => {
            console.error("Error al actualizar el estado del préstamo: ", error);
        });
}

// Función para ocultar los botones después de la acción
function ocultarBotones(loanId) {
    const btnAceptar = document.querySelector(`.btn-aceptar[data-id="${loanId}"]`);
    const btnRechazar = document.querySelector(`.btn-rechazar[data-id="${loanId}"]`);
    if (btnAceptar) btnAceptar.style.display = 'none';
    if (btnRechazar) btnRechazar.style.display = 'none';
}
