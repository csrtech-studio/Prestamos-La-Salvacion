
        window.onload = function () {
            const loan = JSON.parse(localStorage.getItem('loanDetails'));

            if (loan) {
                document.getElementById('loanName').textContent = `Detalles del préstamo de ${loan.name}`;
                document.getElementById('phone').textContent = loan.phone || "No registrado"; // Muestra el teléfono
                document.getElementById('loanDate').textContent = loan.loanDate;
                document.getElementById('loanAmount').textContent = `$${loan.amount.toFixed(2)}`;
                document.getElementById('totalToPay').textContent = `$${loan.totalToPay.toFixed(2)}`;
                document.getElementById('remainingWeeks').textContent = loan.currentWeek;
                document.getElementById('remainingAmount').textContent = `$${loan.remaining.toFixed(2)}`;
                document.getElementById('weeklyPayment').textContent = `$${loan.weeklyPayment.toFixed(2)}`; // Mostrar monto semanal

                const paymentsList = document.getElementById('paymentsList');
                if (loan.payments && loan.payments.length > 0) {
                    loan.payments.forEach(payment => {
                        const paymentItem = document.createElement('li');
                        paymentItem.textContent = `Semana ${payment.week}: Pagado $${payment.paymentAmount.toFixed(2)} el ${payment.date}`;
                        paymentsList.appendChild(paymentItem);
                    });
                } else {
                    alert('No se encontraron pagos registrados.');
                }
            } else {
                alert('No se encontraron los detalles del préstamo.');
            }
        }


        // Función para reenviar último pago usando datos desde localStorage
        function resendLastPayment() {
            // Extraer datos del préstamo desde localStorage
            const loan = JSON.parse(localStorage.getItem('loanDetails'));

            if (loan && loan.payments && loan.payments.length > 0) {
                // Obtener la última semana y fecha desde la lista de pagos
                const lastPayment = loan.payments[loan.payments.length - 1];

                // Crear el mensaje usando plantillas literales
                  const message = `
Estimado/a ${loan.name},

¡Gracias por su pago!  
Le informamos que hemos recibido su pago de la **semana ${lastPayment.week}** correspondiente a su préstamo.

*Monto pagado:* $${lastPayment.paymentAmount.toFixed(2)}  
*Fecha:* ${lastPayment.date}  
*Balance restante:* $${loan.remaining.toFixed(2)}  

Agradecemos su confianza en *Préstamos La Salvación* y quedamos a su disposición para cualquier consulta.  

¡Que tenga un excelente día!

Atentamente,  
*El equipo de Préstamos La Salvación*
`;
                // Codificación del mensaje
                const encodedMessage = encodeURIComponent(message.trim());

                // Obtener el número desde el `loan` directamente
                const phoneNumber = `+52${loan.phone.trim()}`;

                // Enlace para WhatsApp
                const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

                // Redirigir a WhatsApp
                window.location.href = whatsappLink;
            } else {
                alert('No se encontraron los detalles del préstamo o pagos.');
            }
        }

        function goBack() {
            window.location.href = './index.html';
        }
