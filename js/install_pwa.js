let deferredPrompt;
const installButton = document.createElement('button');
installButton.textContent = 'Instalar App';
installButton.id = 'installButton'; // Asignamos un ID para poder darle estilo
installButton.style.display = 'none'; // Oculto por defecto
document.body.appendChild(installButton);

window.addEventListener('beforeinstallprompt', (e) => {
  // Previene que la mini-infobar aparezca en algunos navegadores
  e.preventDefault();
  deferredPrompt = e;
  // Mostrar el botón de instalación
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    installButton.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA instalada correctamente');
      } else {
        console.log('PWA no fue instalada');
      }
      deferredPrompt = null;
    });
  });
});

window.addEventListener('appinstalled', () => {
  console.log('PWA ha sido instalada');
  installButton.style.display = 'none'; // Oculta el botón cuando la PWA se instala
});
