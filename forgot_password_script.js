import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB2P22lorgeiQjHgnvMcguBiP4U9PZUYZs",
    authDomain: "prestamos-la-salvacion.firebaseapp.com",
    projectId: "prestamos-la-salvacion",
    storageBucket: "prestamos-la-salvacion.appspot.com",
    messagingSenderId: "326817496328",
    appId: "1:326817496328:web:6854959ede4e0a0f8700bd"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Manejar el envío del formulario de restablecimiento de contraseña
document.getElementById('resetForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const email = document.getElementById('email').value;

    try {
        await sendPasswordResetEmail(auth, email);
        alert('Se ha enviado un enlace de restablecimiento a tu correo electrónico.');
    } catch (error) {
        console.error("Error al enviar el enlace de restablecimiento: ", error);
        alert('Error al enviar el enlace de restablecimiento. Verifica tu correo.');
    }
});
