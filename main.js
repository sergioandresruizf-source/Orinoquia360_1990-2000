let escenaActual = 0;
const totalEscenas = 25; 
const btnAvanzar = document.getElementById('btnAvanzar');

const musicaLlanera = new Audio('assets/audio/llanera.mp3');
musicaLlanera.load(); 
musicaLlanera.loop = true;
musicaLlanera.volume = 0.9;

const mapaInicio = document.getElementById('mapaInicio');
const textoInstruccion = document.querySelector('.instruccion-toque');

if (mapaInicio) {
    mapaInicio.addEventListener('click', () => {
        textoInstruccion.style.display = 'none';
        mapaInicio.classList.add('zoom-in');
        
        setTimeout(() => {
            avanzarEscena();
        }, 1500);
    });
}

function avanzarEscena() {
    if (escenaActual === totalEscenas) {
        const escenaUltimaDOM = document.getElementById(`escena${escenaActual}`);
        if (escenaUltimaDOM) {
            escenaUltimaDOM.classList.remove('visible');
            escenaUltimaDOM.classList.add('oculta');
        }
        mostrarPantallaFinal();
        return;
    }

    if (escenaActual < totalEscenas) {
        
        const escenaAnteriorDOM = document.getElementById(`escena${escenaActual}`);
        if (escenaAnteriorDOM) {
            escenaAnteriorDOM.classList.remove('visible');
            escenaAnteriorDOM.classList.add('oculta');

            const videoAnterior = escenaAnteriorDOM.querySelector('video');
            if (videoAnterior) videoAnterior.pause();
        }

        escenaActual++;

        const escenaNuevaDOM = document.getElementById(`escena${escenaActual}`);
        if (escenaNuevaDOM) {
            escenaNuevaDOM.classList.remove('oculta');
            escenaNuevaDOM.classList.add('visible');

            const videoNuevo = escenaNuevaDOM.querySelector('video');
            const mapaGoogle = escenaNuevaDOM.querySelector('iframe');
            const fotoPlana = escenaNuevaDOM.querySelector('.imagen-historica');

            if (videoNuevo) {
                videoNuevo.currentTime = 0;
                videoNuevo.play();
                btnAvanzar.style.display = 'none'; 
            } 
            else if (mapaGoogle) {
                btnAvanzar.style.display = 'block';
                
                // Forzar el redibujado de Street View para eliminar la pantalla negra en móviles
                let srcActual = mapaGoogle.src;
                mapaGoogle.src = '';
                setTimeout(() => {
                    mapaGoogle.src = srcActual;
                }, 50);
            }
            else if (fotoPlana) {
                btnAvanzar.style.display = 'block';
            }
        }
    }
}

function mostrarPantallaFinal() {
    btnAvanzar.style.display = 'none'; 
    
    const escenaFinalDOM = document.getElementById('escenaFinal');
    if (escenaFinalDOM) {
        escenaFinalDOM.classList.remove('oculta');
        escenaFinalDOM.classList.add('visible');
    }

    musicaLlanera.play().then(() => {
        console.log("Música llanera sonando exitosamente.");
    }).catch(error => {
        console.log("El navegador bloqueó el autoplay. Se activará con el próximo toque en pantalla:", error);
        document.body.addEventListener('click', () => {
            musicaLlanera.play();
        }, { once: true });
    });
}

btnAvanzar.addEventListener('click', avanzarEscena);

document.querySelectorAll('video').forEach(video => {
    video.addEventListener('ended', avanzarEscena);
});

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



