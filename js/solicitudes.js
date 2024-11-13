import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getDatabase, ref, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

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
        const estatus = loanData.estatus || 'En revisión';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="detalles.html?id=${loanId}" class="nombre-link">${loanData.nombre}</a></td>
            <td>${loanData.monto}</td>
            <td>${loanData.fecha}</td>
            <td class="estatus">${estatus}</td>
            <td>
                <select class="accion-select" data-id="${loanId}" data-telefono="${loanData.telefono}" ${estatus !== 'En revisión' ? 'disabled' : ''}>
                    <option value="">Seleccione</option>
                    <option value="Aprobado">Aceptar</option>
                    <option value="Rechazado">Rechazar</option>
                </select>
                <button class="btn-confirmar" data-id="${loanId}">${estatus === 'En revisión' ? 'Confirmar' : 'Eliminar Registro'}</button>
            </td>
        `;
        loanTableBody.appendChild(row);
    });

    // Añadir eventos a los elementos
    agregarEventos();
});

// Función para agregar eventos a los botones
function agregarEventos() {
    document.querySelectorAll('.btn-confirmar').forEach(button => {
        button.addEventListener('click', () => {
            const loanId = button.getAttribute('data-id');
            const select = document.querySelector(`.accion-select[data-id="${loanId}"]`);
            const accion = select.value;
            const telefono = select.getAttribute('data-telefono');
            
            if (select.disabled) {
                // Si el select está deshabilitado, eliminar el registro
                eliminarSolicitud(loanId);
            } else if (accion) {
                // Si hay una acción seleccionada, actualizar el estatus
                actualizarEstatus(loanId, accion, telefono, button);
            } else {
                alert("Seleccione una acción antes de confirmar.");
            }
        });
    });
}

// Función para actualizar el estado del préstamo y abrir WhatsApp
function actualizarEstatus(loanId, nuevoEstatus, telefono, button) {
    const loanRef = ref(database, `prestamos/${loanId}`);
    update(loanRef, { estatus: nuevoEstatus })
        .then(() => {
            let mensaje;
            if (nuevoEstatus === 'Aprobado') {
                mensaje = encodeURIComponent(
                    `Estimado cliente, su préstamo ha sido aprobado. Proporcione su número de tarjeta.`
                );
            } else {
                mensaje = encodeURIComponent(
                    `Estimado cliente, lamentamos informarle que su solicitud de préstamo ha sido rechazada.`
                );
            }
            window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');

            // Cambiar el texto del botón a "Eliminar Registro"
            button.textContent = "Eliminar Registro";
            button.classList.add('btn-eliminar');
            button.removeEventListener('click', confirmarAccion);
            button.addEventListener('click', () => eliminarSolicitud(loanId));
            
            // Deshabilitar el combo box después de la acción
            const select = document.querySelector(`.accion-select[data-id="${loanId}"]`);
            select.disabled = true;
        })
        .catch((error) => {
            console.error("Error al actualizar el estado del préstamo: ", error);
        });
}

// Función para eliminar la solicitud de préstamo
function eliminarSolicitud(loanId) {
    if (confirm("¿Está seguro de que desea eliminar esta solicitud de préstamo?")) {
        const loanRef = ref(database, `prestamos/${loanId}`);
        remove(loanRef)
            .then(() => {
                alert("La solicitud de préstamo ha sido eliminada.");
            })
            .catch((error) => {
                console.error("Error al eliminar la solicitud: ", error);
            });
    }
}
