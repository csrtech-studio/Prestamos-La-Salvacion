import { auth, db } from './firebaseConfig.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Función para cargar los préstamos pagados y mostrar el total prestado y de ganancia
async function loadPaidLoans() {
    let totalAmount = 0;
    let totalGain = 0;  // Variable para almacenar el total de ganancias
    const tableBody = document.getElementById('paidLoanTableBody');
    
    if (!tableBody) {
        console.error('No se encontró el elemento con el id "paidLoanTableBody".');
        return;
    }

    tableBody.innerHTML = ''; // Limpiar tabla

    try {
        const querySnapshot = await getDocs(collection(db, "paid_loans"));

        querySnapshot.forEach((doc) => {
            const loan = doc.data();
            const gain = loan.amount * 0.5; // Calcula el 50% de ganancia
            totalAmount += loan.amount;
            totalGain += gain;

            // Crear una fila para cada préstamo
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${loan.name}</td>
                <td>${loan.loanDate}</td>
                <td>${loan.amount.toFixed(2)} MXN</td>
                <td>${gain.toFixed(2)} MXN</td> <!-- Mostrar la ganancia -->
                <td>${loan.status}</td>
            `;
            tableBody.appendChild(row);
        });

        // Actualizar el total prestado y el total de ganancia en el HTML
        const totalAmountElement = document.getElementById('totalAmount');
        const totalGainElement = document.getElementById('totalGain');

        if (totalAmountElement) {
            totalAmountElement.textContent = totalAmount.toFixed(2);
        }
        
        if (totalGainElement) {
            totalGainElement.textContent = totalGain.toFixed(2);
        }
    } catch (error) {
        console.error("Error al cargar los préstamos pagados: ", error);
    }
}

// Asegurarse de que el DOM esté completamente cargado antes de ejecutar la función
window.addEventListener('DOMContentLoaded', (event) => {
    loadPaidLoans();
});
