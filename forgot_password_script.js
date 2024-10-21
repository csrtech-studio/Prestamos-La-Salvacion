import { auth, db } from './firebaseConfig.js';
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// Manejar el envío del formulario de restablecimiento de contraseña
document.getElementById('resetForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const email = document.getElementById('email').value;

    try {
        await sendPasswordResetEmail(auth, email);
        alert('Se ha enviado un enlace de restablecimiento a tu correo electrónico.');
        window.location.href = 'login.html'; // Redirigir a la página forgot_password.html
    } catch (error) {
        console.error("Error al enviar el enlace de restablecimiento: ", error);
        alert('Error al enviar el enlace de restablecimiento. Verifica tu correo.');
    }
});
