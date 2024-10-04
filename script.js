import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

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

let loans = [];

// Función para registrar un préstamo
async function registerLoan() {
    const name = document.getElementById('name').value;
    const loanDate = document.getElementById('loanDate').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const weeks = parseInt(document.getElementById('weeks').value);

    if (name && loanDate && amount > 0 && weeks > 0) {
        const interest = amount * 0.5;
        const totalToPay = amount + interest;
        const weeklyPayment = totalToPay / weeks;
        const loan = {
            name,
            loanDate,
            amount,
            interest,
            totalToPay,
            weeks,
            weeklyPayment,
            remaining: totalToPay,
            currentWeek: weeks,
            status: 'Pendiente',
            payments: []
        };

        try {
            const docRef = await addDoc(collection(db, "loans"), loan);
            console.log("Préstamo registrado con ID: ", docRef.id);
            loans.push({ ...loan, id: docRef.id });
            displayLoans();
            clearForm();
        } catch (error) {
            console.error("Error al agregar el préstamo: ", error);
        }
    } else {
        alert('Por favor, completa todos los campos correctamente.');
    }
}

// Función para mostrar préstamos
function displayLoans() {
    const tableBody = document.getElementById('loanTableBody');
    tableBody.innerHTML = '';

    loans.forEach((loan, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.name}</td>
            <td>${loan.loanDate}</td>
            <td>${loan.totalToPay.toFixed(2)}</td>
            <td>${loan.remaining.toFixed(2)}</td>
            <td>
                <button onclick="viewDetails(${index})">Detalles</button>
                ${loan.remaining > 0 ? `<button onclick="makePayment(${index})">Pagar</button>` : ''}
                ${loan.remaining <= 0 ? `<button onclick="deleteLoan(${index})" style="background-color:red; color:white;">Eliminar</button>` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para registrar un pago
async function makePayment(index) {
    const loan = loans[index];

    if (loan.remaining > 0 && loan.currentWeek > 0) {
        const confirmPayment = confirm(`¿Deseas pagar la semana ${loan.weeks - loan.currentWeek + 1}?`);

        if (confirmPayment) {
            const weeklyPayment = loan.weeklyPayment;
            const paymentDate = new Date().toLocaleDateString();

            loan.remaining -= weeklyPayment;
            loan.currentWeek--;

            loan.payments.push({
                week: loan.weeks - loan.currentWeek,
                paymentAmount: weeklyPayment,
                date: paymentDate
            });

            if (loan.remaining <= 0) {
                loan.remaining = 0;
                loan.status = 'Pagado';
            }

            // Actualizar préstamo en Firestore
            try {
                await updateDoc(doc(db, "loans", loan.id), {
                    remaining: loan.remaining,
                    currentWeek: loan.currentWeek,
                    payments: loan.payments,
                    status: loan.status
                });
                displayLoans();
            } catch (error) {
                console.error("Error al actualizar el préstamo: ", error);
            }
        }
    } else {
        alert('No hay saldo pendiente para pagar o ya se completó el préstamo.');
    }
}

// Función para agregar un préstamo pagado a la colección 'paid_loans'
async function addPaidLoan(loan) {
    const paidLoan = {
        name: loan.name,
        loanDate: loan.loanDate,
        amount: loan.amount,
        status: 'Pagado'
    };

    try {
        await addDoc(collection(db, "paid_loans"), paidLoan);
        console.log("Préstamo agregado a 'paid_loans'");
    } catch (error) {
        console.error("Error al agregar el préstamo pagado: ", error);
    }
}

// Función para eliminar un préstamo
async function deleteLoan(index) {
    const loan = loans[index];
    const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el préstamo de ${loan.name}?`);

    if (confirmDelete) {
        try {
            // Mover el préstamo a la colección 'paid_loans'
            await addPaidLoan(loan);
            // Eliminar el préstamo de la colección principal
            await deleteDoc(doc(db, "loans", loan.id));
            loans.splice(index, 1);
            displayLoans();
        } catch (error) {
            console.error("Error al eliminar el préstamo: ", error);
        }
    }
}

// Función para ver detalles del préstamo
function viewDetails(index) {
    const loan = loans[index];
    localStorage.setItem('loanDetails', JSON.stringify(loan));
    window.location.href = 'details.html';
}

// Función para limpiar el formulario
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('loanDate').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('weeks').value = '';
}

// Cargar los préstamos desde Firestore al inicio
async function loadLoans() {
    try {
        const querySnapshot = await getDocs(collection(db, "loans"));
        loans = [];
        querySnapshot.forEach((doc) => {
            loans.push({ id: doc.id, ...doc.data() });
        });
        displayLoans();
    } catch (error) {
        console.error("Error al obtener los préstamos: ", error);
    }
}

// Al cargar la página, asignar el evento de envío del formulario
window.onload = () => {
    loadLoans();
    const loanForm = document.getElementById('loanForm');
    loanForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar el envío del formulario
        registerLoan(); // Llamar a la función para registrar el préstamo
    });
};

// Exponer funciones al ámbito global
window.registerLoan = registerLoan;
window.viewDetails = viewDetails;
window.makePayment = makePayment;
window.deleteLoan = deleteLoan;
