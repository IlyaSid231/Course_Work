import { initializeNavigationButtonsFromHeader } from '/js/eventListeners.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initializeNavigationButtonsFromHeader();

    window.addEventListener('load', function() {
      const preloader = document.getElementById('preloader');
      preloader.classList.add('hide');
    });
});
