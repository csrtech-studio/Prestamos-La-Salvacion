import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";

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

// Función para obtener la fecha actual
function obtenerFechaActual() {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const año = hoy.getFullYear();
    return `${dia}/${mes}/${año}`;
}

// Función para enviar mensaje a WhatsApp
function enviarMensajeWhatsApp(nombre, direccion, telefono, monto) {
    const fecha = obtenerFechaActual();
    const mensaje = `Hola Roberto,\n\nSoy *${nombre}*, y solicito un préstamo a *Préstamos La Salvación* por la cantidad de *${monto}*.\n\n🗓 *Fecha*: ${fecha}\n🏡 *Dirección*: ${direccion}\n📞 *Teléfono*: ${telefono}\n\nEspero su pronta respuesta. Muchas gracias.\n\nSaludos cordiales.`;
    const url = `https://wa.me/5218111825108?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// Función para enviar solicitud
document.getElementById('loanForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const monto = document.getElementById('monto').value.trim();
    const fileInput = document.getElementById('ine');
    const file = fileInput.files[0];

    // Verificar que todos los campos estén completos
    if (!nombre || !direccion || !telefono || !monto || !file) {
        alert('Por favor, completa todos los campos y sube una foto de tu INE.');
        return;
    }

    // Mostrar mensaje de confirmación
    const confirmacion = confirm(`¿La información es correcta?\n\nNombre: ${nombre}\nDirección: ${direccion}\nTeléfono: ${telefono}\nMonto: ${monto}\nFecha: ${obtenerFechaActual()}`);
    if (!confirmacion) {
        alert('Por favor, corrige la información antes de continuar.');
        return;
    }

    // Subir imagen de la INE
    const storagePath = `ine/${file.name}`;
    const storageRefPath = storageRef(storage, storagePath);

    try {
        // Subir la imagen al almacenamiento
        await uploadBytes(storageRefPath, file);
        console.log("Imagen subida exitosamente.");

        // Crear o actualizar la colección en la base de datos
        const dbRef = ref(database, 'prestamos/' + Date.now()); // Usa un ID único basado en la fecha y hora
        await set(dbRef, {
            nombre,
            direccion,
            telefono,
            monto,
            fecha: obtenerFechaActual(),
            ine: storagePath // Guarda la ruta de la imagen en la base de datos
        });
        console.log("Datos guardados en Firebase exitosamente.");

        // Enviar mensaje de WhatsApp
        enviarMensajeWhatsApp(nombre, direccion, telefono, monto);

        // Limpiar el formulario
        document.getElementById('loanForm').reset();
        alert('Solicitud enviada con éxito.');

    } catch (error) {
        console.error("Error al enviar la solicitud: ", error);
        alert(`Error al enviar la solicitud. Intenta de nuevo. Detalles: ${error.message}`);
    }
});
