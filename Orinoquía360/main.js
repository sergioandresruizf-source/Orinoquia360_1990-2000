let escenaActual = 0;
const totalEscenas = 4; // Si agregas más divs en el HTML, sube este número

// 1. Inicializar los visores 360 en segundo plano
pannellum.viewer('panorama1', {
    "type": "equirectangular",
    "panorama": "https://pannellum.org/images/alma.jpg", 
    "autoLoad": true,
    "showControls": false // Oculta botones para limpieza visual
});

pannellum.viewer('panorama2', {
    "type": "equirectangular",
    "panorama": "https://pannellum.org/images/cerro-toco-0.jpg", 
    "autoLoad": true,
    "showControls": false
});

// 2. Lógica para avanzar de escena al tocar la pantalla
document.body.addEventListener('click', () => {
    if (escenaActual < totalEscenas) {
        
        // Pausar el video de la escena que se va a ocultar (si existe)
        const videoAnterior = document.querySelector(`#escena${escenaActual} video`);
        if (videoAnterior) {
            videoAnterior.pause();
        }

        // Ocultar la escena actual
        document.getElementById(`escena${escenaActual}`).classList.remove('visible');
        document.getElementById(`escena${escenaActual}`).classList.add('oculta');

        // Avanzar el contador
        escenaActual++;

        // Mostrar la nueva escena
        document.getElementById(`escena${escenaActual}`).classList.remove('oculta');
        document.getElementById(`escena${escenaActual}`).classList.add('visible');

        // Reproducir el video de la nueva escena (si existe)
        const videoNuevo = document.querySelector(`#escena${escenaActual} video`);
        if (videoNuevo) {
            videoNuevo.currentTime = 0; // Se asegura de que inicie desde el segundo 0
            videoNuevo.play();
        }
    }
});