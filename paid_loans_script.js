import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB2P22lorgeiQjHgnvMcguBiP4U9PZUYZs",
    authDomain: "prestamos-la-salvacion.firebaseapp.com",
    projectId: "prestamos-la-salvacion",
    storageBucket: "prestamos-la-salvation.appspot.com",
    messagingSenderId: "326817496328",
    appId: "1:326817496328:web:6854959ede4e0a0f8700bd"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para cargar los préstamos pagados y mostrar el total prestado
async function loadPaidLoans() {
    let totalAmount = 0;
    const tableBody = document.getElementById('paidLoanTableBody');
    
    // Verificar si el elemento existe en el DOM
    if (!tableBody) {
        console.error('No se encontró el elemento con el id "paidLoanTableBody".');
        return;
    }

    tableBody.innerHTML = ''; // Limpiar tabla

    try {
        const querySnapshot = await getDocs(collection(db, "paid_loans"));

        querySnapshot.forEach((doc) => {
            const loan = doc.data();
            totalAmount += loan.amount;

            // Crear una fila para cada préstamo
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${loan.name}</td>
                <td>${loan.loanDate}</td>
                <td>${loan.amount.toFixed(2)} MXN</td>
                <td>${loan.status}</td>
            `;
            tableBody.appendChild(row);
        });

        // Actualizar el total prestado en el HTML
        const totalAmountElement = document.getElementById('totalAmount');
        if (totalAmountElement) {
            totalAmountElement.textContent = totalAmount.toFixed(2);
        }
    } catch (error) {
        console.error("Error al cargar los préstamos pagados: ", error);
    }
}

// Asegurarse de que el DOM esté completamente cargado antes de ejecutar la función
window.addEventListener('DOMContentLoaded', (event) => {
    loadPaidLoans();
});
