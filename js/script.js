import { db, auth } from './firebaseConfig.js';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

let loans = [];
const deleteKey = "salvacion"; // Almacenada en texto plano por simplicidad
let inactivityTimer;

// Función para verificar la autenticación del usuario
function checkAuthentication() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'login.html'; // Redirigir al login si no está autenticado
        }
    });
}

// Función para cerrar sesión
function autoLogout() {
    signOut(auth).then(() => {
        window.location.href = 'login.html'; // Redirigir a la página de login
    }).catch((error) => {
        console.error("Error al cerrar sesión: ", error);
    });
}

// Función para reiniciar el temporizador de inactividad
function resetTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(autoLogout, 60000); // 60000 ms = 1 minuto
}

// Asignar eventos para reiniciar el temporizador
window.addEventListener('mousemove', resetTimer);
window.addEventListener('keypress', resetTimer);
window.addEventListener('click', resetTimer);
window.addEventListener('scroll', resetTimer);


// Función para registrar un préstamo
async function registerLoan() {
    const name = document.getElementById('name').value;
    const loanDate = document.getElementById('loanDate').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const weeks = parseInt(document.getElementById('weeks').value);
    const phone = document.getElementById('phone').value; // Nuevo campo

    if (name && loanDate && amount > 0 && weeks > 0 && phone) {
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
            phone, // Nuevo campo añadido
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
    tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

    if (loans.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No hay préstamos registrados</td></tr>'; // Mostrar mensaje si no hay préstamos
        return;
    }

    loans.forEach((loan, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" onclick="confirmDelete(${index})">${loan.name}</a></td>
            <td>${loan.loanDate}</td>
            <td>${loan.totalToPay.toFixed(2)}</td>
            <td>${loan.remaining.toFixed(2)}</td>
            <td>
                <button onclick="viewDetails(${index})">Detalles</button>
                ${loan.remaining > 0 ? 
                    `<button onclick="makePayment(${index})">Pagar</button>` : 
                    `<button class="green-button" onclick="savePaidLoan(${index})">Guardar</button>`
                }
            </td>
        `;
        tableBody.appendChild(row);
    });

    console.log("Préstamos mostrados en la tabla.");
}

// Función para confirmar la eliminación del préstamo
async function confirmDelete(index) {
    const loan = loans[index];
    const deleteKeyInput = prompt(`¿Deseas eliminar el préstamo de ${loan.name}? Esta acción no se puede deshacer. \n\nIngresa la clave para eliminar:`);

    if (deleteKeyInput === deleteKey) {
        try {
            await deleteDoc(doc(db, "loans", loan.id));
            loans.splice(index, 1);
            displayLoans();
            alert('Registro eliminado correctamente.');
        } catch (error) {
            console.error("Error al eliminar el préstamo: ", error);
        }
    } else {
        alert('Error de código. Verifica e intenta de nuevo.');
    }
}

// Función para registrar un pago
async function makePayment(index) {
    const loan = loans[index];

    if (loan.remaining > 0 && loan.currentWeek > 0) {
        const confirmPayment = confirm(`¿Deseas pagar la semana ${loan.weeks - loan.currentWeek + 1} de ${loan.name}?`);

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

            try {
                await updateDoc(doc(db, "loans", loan.id), {
                    remaining: loan.remaining,
                    currentWeek: loan.currentWeek,
                    payments: loan.payments,
                    status: loan.status
                });
                displayLoans();

                // Nueva confirmación para enviar información al cliente
                const confirmSendInfo = confirm(`¿Deseas mandar información al cliente?`);

                if (confirmSendInfo) {
                    const message = `
Estimado/a ${loan.name},

¡Gracias por su pago!

Le informamos que hemos recibido su pago de la semana ${loan.weeks - loan.currentWeek} correspondiente a su préstamo.

**Balance restante:** $${loan.remaining.toFixed(2)}

Agradecemos su confianza en **Préstamos La Salvación** y quedamos a su disposición para cualquier consulta.

¡Que tenga un excelente día!

Atentamente,  
**El equipo de Préstamos La Salvación**
                    `;
                    const whatsappMessage = encodeURIComponent(message.trim());
                    const phoneNumber = loan.phone; // Asegúrate de que el número de teléfono esté en el formato correcto

                    // Abrir WhatsApp con el mensaje estructurado
                    window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`);
                }
            } catch (error) {
                console.error("Error al actualizar el préstamo: ", error);
            }
        }
    } else {
        alert('No hay saldo pendiente para pagar o ya se completó el préstamo.');
    }
}

// Función para guardar el préstamo pagado en la colección 'paid_loans'
async function savePaidLoan(index) {
    const loan = loans[index];

    try {
        await addPaidLoan(loan);
        console.log("Préstamo guardado en 'paid_loans'");

        await deleteDoc(doc(db, "loans", loan.id));
        loans.splice(index, 1);
        displayLoans();

        alert('Préstamo guardado correctamente.');
    } catch (error) {
        console.error("Error al guardar el préstamo: ", error);
    }
}

// Función para agregar un préstamo pagado a la colección 'paid_loans'
async function addPaidLoan(loan) {
    const paidLoan = {
        name: loan.name,
        loanDate: loan.loanDate,
        amount: loan.amount,
        phone: loan.phone, // Añadir teléfono al préstamo pagado
        status: 'Pagado'
    };

    try {
        await addDoc(collection(db, "paid_loans"), paidLoan);
        console.log("Préstamo agregado a 'paid_loans'");
    } catch (error) {
        console.error("Error al agregar el préstamo pagado: ", error);
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
    document.getElementById('phone').value = ''; // Limpiar el campo de teléfono
}

// Función para cargar los préstamos desde Firestore
async function loadLoans() {
    try {
        const querySnapshot = await getDocs(collection(db, "loans"));
        loans = [];
        querySnapshot.forEach((doc) => {
            loans.push({ id: doc.id, ...doc.data() });
        });
        console.log("Préstamos cargados:", loans);
        displayLoans();
    } catch (error) {
        console.error("Error al obtener los préstamos: ", error);
    }
}

// Función para cerrar sesión
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'login.html'; // Redirigir a la página de login
    } catch (error) {
        console.error("Error al cerrar sesión: ", error);
    }
});

// Al cargar la página, asignar el evento de envío del formulario
window.onload = () => {
    loadLoans(); // Llamar a la función para cargar los préstamos
    const loanForm = document.getElementById('loanForm');
    loanForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar el envío del formulario
        registerLoan(); // Llamar a la función para registrar el préstamo
    });
};


// Al cargar la página, verificar la autenticación
window.onload = () => {
    checkAuthentication(); // Verificar la autenticación
    loadLoans(); // Cargar los préstamos
    const loanForm = document.getElementById('loanForm');
    loanForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar el envío del formulario
        registerLoan(); // Llamar a la función para registrar el préstamo
    });
};

// Exponer funciones al ámbito global para que se puedan usar en el HTML
window.confirmDelete = confirmDelete;
window.makePayment = makePayment;
window.savePaidLoan = savePaidLoan;
window.viewDetails = viewDetails;


