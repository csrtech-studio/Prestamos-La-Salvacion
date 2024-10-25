window.onload = function() {
    const loan = JSON.parse(localStorage.getItem('loanDetails'));

    if (loan) {
        document.getElementById('loanName').textContent = `Detalles del préstamo de ${loan.name}`;
        document.getElementById('loanDate').textContent = loan.loanDate;
        document.getElementById('loanAmount').textContent = `$${loan.amount.toFixed(2)}`;
        document.getElementById('totalToPay').textContent = `$${loan.totalToPay.toFixed(2)}`;
        document.getElementById('remainingWeeks').textContent = loan.currentWeek;
        document.getElementById('remainingAmount').textContent = `$${loan.remaining.toFixed(2)}`;
        document.getElementById('weeklyPayment').textContent = `$${loan.weeklyPayment.toFixed(2)}`; // Mostrar monto semanal

        const paymentsList = document.getElementById('paymentsList');
        loan.payments.forEach(payment => {
            const paymentItem = document.createElement('li');
            paymentItem.textContent = `Semana ${payment.week}: Pagado $${payment.paymentAmount.toFixed(2)} el ${payment.date}`;
            paymentsList.appendChild(paymentItem);
        });
    } else {
        alert('No se encontraron los detalles del préstamo.');
    }
}

function goBack() {
    window.location.href = './index.html';
}