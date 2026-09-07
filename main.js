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

    // Si aún estamos recorriendo las escenas normales
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

                // Solución para forzar el redibujado correcto del 360 en móviles
                setTimeout(() => {
                    if (visor360Actual) {
                        visor360Actual.resize();
                    }
                }, 200);
            }
            else if (mapaGoogle || fotoPlana) {
                btnAvanzar.style.display = 'block';
            }
        }
    }
}

// Función dedicada exclusivamente a mostrar los créditos y la música llanera de fondo
function mostrarPantallaFinal() {
    btnAvanzar.style.display = 'none'; // Oculta la flecha definitivamente
    
    const escenaFinalDOM = document.getElementById('escenaFinal');
    if (escenaFinalDOM) {
        escenaFinalDOM.classList.remove('oculta');
        escenaFinalDOM.classList.add('visible');
    }

    // Reproducimos el audio precargado de forma instantánea
    musicaLlanera.play().then(() => {
        console.log("Música llanera sonando exitosamente.");
    }).catch(error => {
        console.log("El navegador bloqueó el autoplay. Se activará con el próximo toque en pantalla:", error);
        
        // Plan B: Si el navegador bloquea la reproducción automática por políticas de seguridad
        document.body.addEventListener('click', () => {
            musicaLlanera.play();
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
let escobarTerminado = false;

if (videoEscobar) {
    videoEscobar.addEventListener('timeupdate', () => {
        if (videoEscobar.currentTime >= 31 && !escobarTerminado) {
            escobarTerminado = true;
            avanzarEscena(); 
        }
    });
}

// Control de tiempo para el video del Proceso de Paz (vid3)
const videoProcesoPaz = document.getElementById('vid3');
let procesoPazTerminado = false;

if (videoProcesoPaz) {
    videoProcesoPaz.addEventListener('timeupdate', () => {
        if (videoProcesoPaz.currentTime >= 36 && !procesoPazTerminado) {
            procesoPazTerminado = true;
            avanzarEscena();
        }
    });
}

// Control de tiempo para el video de Higuita (vid2)
const videoHiguita = document.getElementById('vid2');
let higuitaTerminado = false;

if (videoHiguita) {
    videoHiguita.addEventListener('timeupdate', () => {
        if (videoHiguita.currentTime >= 10 && !higuitaTerminado) { // Ajusta los segundos si lo ves muy corto/largo
            higuitaTerminado = true;
            avanzarEscena();
        }
    });
}