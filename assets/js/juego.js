
let   mazo               = [];
const tipos              = ['C', 'D', 'H', 'S'];
const figuras            = ['A', 'J', 'K', 'Q'];
const fichas             = [10, 20, 50, 100];
const dineroJugador      = 500;

let ultimaCarta;
let dineroInicial        = dineroJugador;

let puntajeJugador       = 0,
    puntajeComputadora   = 0,
    totalFicha10         = 0,
    totalFicha20         = 0,
    totalFicha50         = 0,
    totalFicha100        = 0,
    totalApuesta         = 0;

const badgeDinero        = document.querySelector('#dinero span');
const fichasApuesta      = document.querySelectorAll('#fichas a');
const badges             = document.querySelectorAll('#fichas span');
const opcionesApuesta    = document.querySelectorAll('#opciones-apuesta button');
const opcionesJuego      = document.querySelectorAll('#opciones-juego button');
const spans              = document.querySelectorAll('span');
const jugadorCarta       = document.querySelector('#jugador-cartas');
const computadoraCarta   = document.querySelector('#computadora-cartas');

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList        = [...tooltipTriggerList].map(tooltipTriggerEl => 
                                                        new bootstrap.Tooltip(tooltipTriggerEl));

/* Crea y baraja las cartas */
const crearMazo = () => {
    for (let i = 2; i <= 10; i++) {
        for (let tipo of tipos) {
            mazo.push(i + tipo);
        }
    }

    for (let figura of figuras) {
        for (let tipo of tipos) {
            mazo.push(figura + tipo);
        }
    }

    /* Baraja el mazo de cartas */
    let i = mazo.length;
    while (--i > 0) {
        let randIndex = Math.floor(Math.random() * (i + 1));
        [mazo[randIndex], mazo[i]] = [mazo[i], mazo[randIndex]];
    }
};

/* Selecciona la última carta del mazo */
const pedirCarta = () => {
    if (mazo.length === 0) {
        throw 'Lo siento, no hay mas cartas en el mazo.';
    }
    const carta = mazo.pop();
    return carta;
};

/* Devuelve el valor de la carta selleccionada 
   A => 1 ó 11
   J, K, Q => 10
   2C, 2D, 2H, 2S => 2         3C, 3D, 3H, 3S => 3         4C, 4D, 4H, 4S => 4
   5C, 5D, 5H, 5S => 5         6C, 6D, 6H, 6S => 6         7C, 7D, 7H, 7S => 7
   8C, 8D, 8H, 8S => 8         9C, 9D, 9H, 9S => 9
*/
const valorCarta = (intento, carta, puntaje) => {
    const valor      = carta.substring(0, carta.length - 1);
    let   valorCarta = (!isNaN(valor)) ? valor * 1 : (valor === 'A') ? 1 : 10;

    if ((intento == 2 && puntaje == 1) && valorCarta == 10) {
        valorCarta = 20;
    } else if ((intento == 2 && puntaje == 10) && valorCarta == 1) {
        valorCarta = 11;
    }

    return valorCarta;
}

/* Prepara el escenario para una nueva apuesta */
const nuevaApuesta = (saldoDinero) => {
    mazo                    = [];
    crearMazo();
    const cartasJugador     = jugadorCarta.querySelectorAll('img');
    const cartasComputadora = computadoraCarta.querySelectorAll('img');
    puntajeJugador          = 0;
    puntajeComputadora      = 0;
    dineroInicial           = saldoDinero;
    badgeDinero.innerText   = saldoDinero;

    if (cartasJugador.length > 0) {
        cartasJugador.forEach((carta) => carta.remove());
    }
    if (cartasComputadora.length > 0) {
        cartasComputadora.forEach((carta) => carta.remove());
    }
};

const mostrarMensaje = (icono, titulo, mensaje) => {
    Swal.fire({
        icon: icono,
        title: titulo,
        text: mensaje,
        toast: true,
        position: 'bottom-end'
    })
};

/* Agrupa las cartas seleccionadas por el Jugador y calcula su puntaje respectivo */
const turnoJugador = (intento) => {
    const carta           = pedirCarta();
    puntajeJugador        = puntajeJugador + valorCarta(intento, carta, puntajeJugador);
    const imagenCarta     = document.createElement('img');
    imagenCarta.src       = `./assets/images/${carta}.png`;
    imagenCarta.classList.add('shadow');
    jugadorCarta.append(imagenCarta);

    if (puntajeJugador >= 21) {
        onDetenerPartida();
    }
};

/* Agrupa las cartas seleccionadas por la Computadora y calcula su puntaje respectivo */
const turnoComputadora = (intento) => {
    ultimaCarta        = pedirCarta();
    puntajeComputadora = puntajeComputadora + valorCarta(intento, ultimaCarta, puntajeComputadora);
    const imagenCarta  = document.createElement('img');
    if (intento === 2) {
        imagenCarta.src = './assets/images/blue-back.png';
    } else {
        imagenCarta.src = `./assets/images/${ultimaCarta}.png`;
    }
    imagenCarta.classList.add('shadow');
    computadoraCarta.append(imagenCarta);
};

const habilitarElementos = (elementos) => {
    elementos.forEach((elemento) => elemento.classList.remove('disabled'));
}

const deshabilitarElementos = (elementos) => {
    elementos.forEach((elemento) => elemento.classList.add('disabled'));
}

const onReiniciarApuesta = () => {
    totalFicha10  = 0;
    totalFicha20  = 0;
    totalFicha50  = 0,
    totalFicha100 = 0;
    totalApuesta  = 0;
    badges.forEach((badge) => badge.innerText = 0);
}

const onRealizarApuesta = () => {
    if (totalApuesta > 0 && totalApuesta <= dineroInicial) {
        dineroInicial         = dineroInicial - totalApuesta;
        badgeDinero.innerText = dineroInicial;
        for (let intento = 1; intento <= 2; intento++) {
            turnoComputadora(intento);
            turnoJugador(intento);
        }
        deshabilitarElementos(fichasApuesta);
        deshabilitarElementos(opcionesApuesta);
        habilitarElementos(opcionesJuego);
    } else if (totalApuesta === 0) {
        mostrarMensaje('info', '¡Uups...!', 'Para apostar primero debes comprar fichas.');
    } else {
        mostrarMensaje('info', '¡Uups...!', 'No tienes suficiente dinero para comprar fichas.');
    }
};

const onNuevaPartida = () => {
    onReiniciarApuesta();
    habilitarElementos(fichasApuesta);
    nuevaApuesta(dineroJugador);
    deshabilitarElementos(opcionesJuego);
};

const onDetenerPartida = () => {
    deshabilitarElementos(opcionesJuego);
    const cartas  = document.querySelectorAll('#computadora-cartas img');
    cartas[1].src = `./assets/images/${ultimaCarta}.png`;
    cartas[1].classList.add('shadow');
    while (puntajeComputadora <= 16) {
        turnoComputadora(0);
    }
    if (puntajeJugador <= 21 && (puntajeJugador > puntajeComputadora || puntajeComputadora > 21)) {
        mostrarMensaje('success', '¡Felicidades!', 'Ganaste la partida.');
        dineroInicial = dineroInicial + (totalApuesta * 2);
    } else if (puntajeComputadora === puntajeJugador) {
        mostrarMensaje('info', '¡Uups...!', 'No hay un ganador en la partida.');
        dineroInicial = dineroInicial + totalApuesta;
    } else {
        mostrarMensaje('error', '¡Lo siento!', 'Perdiste la partida.');
    }
    setTimeout(() => {
        onReiniciarApuesta();
        habilitarElementos(fichasApuesta);
        nuevaApuesta(dineroInicial);
    }, 5000);
};

const mostrarTotalFichasApuesta = (totalFicha, valorFicha, tagTotalFicha) => {
    if (totalFicha <= 5) {
        totalApuesta            = totalApuesta + valorFicha;
        tagTotalFicha.innerText = totalFicha;
        badges[4].innerText     = totalApuesta;
    }
    if (opcionesApuesta[0].classList.contains('disabled') && 
        opcionesApuesta[0].classList.contains('disabled')) {
        habilitarElementos(opcionesApuesta);
    }
};

fichasApuesta[0].addEventListener('click', () => {
    totalFicha10++;
    mostrarTotalFichasApuesta(totalFicha10, fichas[0], badges[0]);
});

fichasApuesta[1].addEventListener('click', () => {
    totalFicha20++;
    mostrarTotalFichasApuesta(totalFicha20, fichas[1], badges[1]);
});

fichasApuesta[2].addEventListener('click', () => {
    totalFicha50++;
    mostrarTotalFichasApuesta(totalFicha50, fichas[2], badges[2]);
});

fichasApuesta[3].addEventListener('click', () => {
    totalFicha100++;
    mostrarTotalFichasApuesta(totalFicha100, fichas[3], badges[3]);
});

opcionesApuesta[0].addEventListener('click', () => {
    onReiniciarApuesta();
    deshabilitarElementos(opcionesApuesta);
});

opcionesApuesta[1].addEventListener('click', () => onRealizarApuesta());

opcionesJuego[0].addEventListener('click', () => onNuevaPartida());

opcionesJuego[1].addEventListener('click', () => turnoJugador(0));

opcionesJuego[2].addEventListener('click', () => onDetenerPartida());

badgeDinero.innerText = dineroJugador;
crearMazo();