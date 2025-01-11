import { db } from './firebaseConfig.js'; // Importa la configuración de Firebase correctamente
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

document.getElementById('updatePhoneButton').addEventListener('click', updatePhone);

export async function updatePhone() {
    const newPhone = prompt('Ingrese el nuevo número de teléfono:');

    // Validación para asegurar que solo contenga 10 dígitos y sean números
    if (/^\d{10}$/.test(newPhone)) {
        const loan = JSON.parse(localStorage.getItem('loanDetails'));

        try {
            await updateDoc(doc(db, "loans", loan.id), { phone: newPhone });
            document.getElementById('phone').textContent = newPhone;
            alert('Teléfono actualizado correctamente.');
        } catch (error) {
            console.error("Error al actualizar el teléfono: ", error);
            alert('Error al actualizar el teléfono.');
        }
    } else {
        alert('Por favor ingrese un número válido de 10 dígitos.');
    }
}
