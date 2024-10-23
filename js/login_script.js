import { auth, db } from './firebaseConfig.js';
import {signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";


// Manejar el envío del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // El inicio de sesión fue exitoso, redirigir a index.html
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Error al iniciar sesión: ", error);
        alert('Error al iniciar sesión. Verifica tus credenciales.');
    }
});
