let escenaActual = 0;
const totalEscenas = 25; 
const btnAvanzar = document.getElementById('btnAvanzar');
let visor360Actual = null; // Guardará el visor para borrarlo de la memoria
// Precargamos el audio en segundo plano apenas abre la página para que esté listo al final
const musicaLlanera = new Audio('assets/audio/llanera.mp3');
musicaLlanera.load(); // Le dice al navegador que lo vaya leyendo de una vez
musicaLlanera.loop = true;
musicaLlanera.volume = 0.9;

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
// --- Lógica central para cambiar de escenas ---
function avanzarEscena() {
    
    // 1. Si ya estamos en la última escena numérica, saltamos directo a los créditos
    if (escenaActual === totalEscenas) {
        // Ocultar la última escena activa antes de mostrar los créditos
        const escenaUltimaDOM = document.getElementById(`escena${escenaActual}`);
        if (escenaUltimaDOM) {
            escenaUltimaDOM.classList.remove('visible');
            escenaUltimaDOM.classList.add('oculta');
        }
        mostrarPantallaFinal();
        return;
    }

    // Si aún estamos recorriendo las escenas normales (del 0 al 25)
    if (escenaActual < totalEscenas) {
        
        const escenaAnteriorDOM = document.getElementById(`escena${escenaActual}`);
        if (escenaAnteriorDOM) {
            escenaAnteriorDOM.classList.remove('visible');
            escenaAnteriorDOM.classList.add('oculta');

            const videoAnterior = escenaAnteriorDOM.querySelector('video');
            if (videoAnterior) videoAnterior.pause();
        }

        if (visor360Actual) {
            visor360Actual.destroy();
            visor360Actual = null;
        }

        escenaActual++;

        const escenaNuevaDOM = document.getElementById(`escena${escenaActual}`);
        if (escenaNuevaDOM) {
            escenaNuevaDOM.classList.remove('oculta');
            escenaNuevaDOM.classList.add('visible');

            const videoNuevo = escenaNuevaDOM.querySelector('video');
            const contenedor360 = escenaNuevaDOM.querySelector('.visor360');
            const mapaGoogle = escenaNuevaDOM.querySelector('iframe');
            const fotoPlana = escenaNuevaDOM.querySelector('.imagen-historica');

            if (videoNuevo) {
                videoNuevo.currentTime = 0;
                videoNuevo.play();
                btnAvanzar.style.display = 'none'; 
            } 
            else if (contenedor360) {
                btnAvanzar.style.display = 'block';
                const rutaImagen = contenedor360.getAttribute('data-img');
                visor360Actual = pannellum.viewer(contenedor360.id, {
                    "type": "equirectangular",
                    "panorama": rutaImagen,
                    "autoLoad": true,
                    "showControls": false
                });
            }
            else if (mapaGoogle || fotoPlana) {
                btnAvanzar.style.display = 'block';
            }
        }
    }
}

// Función dedicada exclusivamente a apagar la flecha y mostrar tus créditos finales
// Muestra los créditos y reproduce la música llanera de fondo de forma segura
function mostrarPantallaFinal() {
    btnAvanzar.style.display = 'none'; // Oculta la flecha definitivamente
    
    const escenaFinalDOM = document.getElementById('escenaFinal');
    if (escenaFinalDOM) {
        escenaFinalDOM.classList.remove('oculta');
        escenaFinalDOM.classList.add('visible');
    }

    // Solución robusta para saltarse el bloqueo de audio del navegador:
    // Creamos el objeto de audio por código en el instante exacto del clic
    const musica = new Audio('assets/audio/llanera.mp3');
    musica.loop = true; // Hace que se repita si la exposición es larga
    musica.volume = 0.9; // Volumen al 90%
    
    // Intentamos reproducir
    musica.play().then(() => {
        console.log("Música llanera sonando exitosamente.");
    }).catch(error => {
        console.log("El navegador bloqueó el autoplay. Se activará con el próximo toque en pantalla:", error);
        
        // Plan B: Si por alguna razón el navegador se pone terco, 
        // configuramos para que suene con cualquier toque adicional en la pantalla final
        document.body.addEventListener('click', () => {
            musica.play();
        }, { once: true });
    });
}

// Configurar el botón de avanzar manual
btnAvanzar.addEventListener('click', avanzarEscena);

// Hacer que todos los videos avancen a la siguiente escena automáticamente al terminar
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('ended', avanzarEscena);
});
// Control de tiempo para el video de Pablo Escobar (vid1)
const videoEscobar = document.getElementById('vid1');
let escobarTerminado = false; // Flag de seguridad

if (videoEscobar) {
    // timeupdate se dispara constantemente mientras el video avanza
    videoEscobar.addEventListener('timeupdate', () => {
        
        // Cambia el 10 por el segundo exacto en el que quieres cortarlo
        if (videoEscobar.currentTime >= 31 && !escobarTerminado) {//30
            escobarTerminado = true; // Bloqueamos la puerta
            avanzarEscena(); 
        }
    });
}
const videoProcesoPaz = document.getElementById('vid3');
let procesoPazTerminado = false;
if (videoProcesoPaz) {
    // timeupdate se dispara constantemente mientras el video avanza
    videoProcesoPaz.addEventListener('timeupdate', () => {
        
        // Cambia el 10 por el segundo exacto en el que quieres cortarlo
        if (videoProcesoPaz.currentTime >= 36 && !procesoPazTerminado) {//35
            procesoPazTerminado = true; // Bloqueamos la puerta
            avanzarEscena();
        }
    });
}
