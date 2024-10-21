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
            <td>${loanData.nombre}</td>
            <td>${loanData.direccion}</td>
            <td>${loanData.telefono}</td>
            <td>${loanData.monto}</td>
            <td>${loanData.fecha}</td>
            <td><a href="${loanData.ine}" target="_blank">Ver INE</a></td>
            <td class="estatus">${estatus}</td>
            <td>
                <button class="btn-aceptar" data-id="${loanId}" data-telefono="${loanData.telefono}" ${estatus !== 'En revisión' ? 'disabled' : ''}>Aceptar</button>
                <button class="btn-rechazar" data-id="${loanId}" data-telefono="${loanData.telefono}" ${estatus !== 'En revisión' ? 'disabled' : ''}>Rechazar</button>
            </td>
        `;
        loanTableBody.appendChild(row);

        // Deshabilitar los botones si el estatus ya no está en revisión
        if (estatus !== 'En revisión') {
            const buttons = row.querySelectorAll('button');
            buttons.forEach(button => button.disabled = true);
        }
    });

    // Añadir eventos a los botones
    document.querySelectorAll('.btn-aceptar').forEach(button => {
        button.addEventListener('click', () => cambiarEstatus(button.dataset.id, 'Aceptado', button.dataset.telefono, button));
    });

    document.querySelectorAll('.btn-rechazar').forEach(button => {
        button.addEventListener('click', () => cambiarEstatus(button.dataset.id, 'Rechazado', button.dataset.telefono, button));
    });
});

// Función para cambiar el estatus en Firebase y enviar mensaje por WhatsApp
function cambiarEstatus(loanId, nuevoEstatus, telefono, button) {
    const updates = {};
    updates[`prestamos/${loanId}/estatus`] = nuevoEstatus;
    
    update(ref(database), updates)
        .then(() => {
            enviarMensajeWhatsApp(nuevoEstatus, telefono);
            alert(`El préstamo ha sido ${nuevoEstatus}.`);

            // Deshabilitar los botones después de seleccionar una opción
            const row = button.parentElement.parentElement;
            row.querySelector('.btn-aceptar').disabled = true;
            row.querySelector('.btn-rechazar').disabled = true;
        })
        .catch((error) => {
            console.error('Error al actualizar el estatus:', error);
        });
}

// Función para enviar mensaje por WhatsApp
function enviarMensajeWhatsApp(estatus, telefono) {
    let mensaje = '';

    if (estatus === 'Aceptado') {
        mensaje = `Hola,\n\nTu solicitud de préstamo ha sido *Aceptada* en Préstamos La Salvación.\n\nTu dinero se depositará en las próximas 2 horas. Por favor, proporciona el número de tu tarjeta o cuenta para proceder con el depósito.\n\nGracias por tu confianza.`;
    } else if (estatus === 'Rechazado') {
        mensaje = `Hola,\n\nLamentablemente, tu solicitud de préstamo ha sido *Rechazada* en Préstamos La Salvación.\n\nTe pedimos disculpas, pero puedes intentarlo más adelante. Agradecemos tu comprensión.\n\nGracias por confiar en nosotros.`;
    }

    const url = `https://wa.me/521${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}
