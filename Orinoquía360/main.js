let escenaActual = 0;
const totalEscenas = 14; // Va del 0 al 14 (15 escenas en total)
const btnAvanzar = document.getElementById('btnAvanzar');
let visor360Actual = null; // Guardará el visor para borrarlo de la memoria

// --- Lógica del mapa interactivo inicial ---
const mapaInicio = document.getElementById('mapaInicio');
const textoInstruccion = document.querySelector('.instruccion-toque');

if (mapaInicio) {
    mapaInicio.addEventListener('click', () => {
        // Ocultamos el texto de instrucción
        textoInstruccion.style.display = 'none';
        
        // Añadimos la clase que dispara el zoom masivo en CSS
        mapaInicio.classList.add('zoom-in');
        
        // Esperamos 1.5 segundos a que termine el zoom para cambiar de escena
        setTimeout(() => {
            avanzarEscena();
        }, 1500);
    });
}

// --- Lógica central para cambiar de escenas ---
function avanzarEscena() {
    if (escenaActual < totalEscenas) {
        
        // 1. Limpiar y ocultar la escena anterior
        const escenaAnteriorDOM = document.getElementById(`escena${escenaActual}`);
        escenaAnteriorDOM.classList.remove('visible');
        escenaAnteriorDOM.classList.add('oculta');

        // Pausar video si veníamos de uno
        const videoAnterior = escenaAnteriorDOM.querySelector('video');
        if (videoAnterior) videoAnterior.pause();

        // Destruir el visor 360 anterior para liberar memoria RAM
        if (visor360Actual) {
            visor360Actual.destroy();
            visor360Actual = null;
        }

        // 2. Avanzar contador y preparar la nueva escena
        escenaActual++;
        const escenaNuevaDOM = document.getElementById(`escena${escenaActual}`);
        escenaNuevaDOM.classList.remove('oculta');
        escenaNuevaDOM.classList.add('visible');

        // 3. Determinar qué contiene la nueva escena (Video o 360)
        const videoNuevo = escenaNuevaDOM.querySelector('video');
        const contenedor360 = escenaNuevaDOM.querySelector('.visor360');

        if (videoNuevo) {
            // Si es un video, ocultamos el botón y reproducimos
            videoNuevo.currentTime = 0;
            videoNuevo.play();
            btnAvanzar.style.display = 'none'; 
        } 
        else if (contenedor360) {
            // Si es 360, mostramos el botón y renderizamos la imagen
            btnAvanzar.style.display = 'block';
            
            // Leemos la ruta de la imagen desde el HTML
            const rutaImagen = contenedor360.getAttribute('data-img');
            
            // Creamos el visor 360 en este preciso instante
            visor360Actual = pannellum.viewer(contenedor360.id, {
                "type": "equirectangular",
                "panorama": rutaImagen,
                "autoLoad": true,
                "showControls": false
            });
        }
    } else {
        // Fin de la presentación
        btnAvanzar.style.display = 'none'; 
    }
}

// Configurar el botón de avanzar manual
btnAvanzar.addEventListener('click', avanzarEscena);

// Hacer que todos los videos avancen a la siguiente escena automáticamente al terminar
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('ended', avanzarEscena);
});