(() => {
    'use strict'

    let   mazo               = [],
          puntosJugadores    = [ 0, 0 ],
          totalFichas        = [ 0, 0, 0, 0, 0 ];
    
    const tipos              = [ 'C', 'D', 'H', 'S' ],
          figuras            = [ 'A', 'J', 'K', 'Q' ],
          fichas             = [ 10, 20, 50, 100 ],
          dineroJugador      = 500;

    let ultimaCarta,
        dineroInicial        = dineroJugador;

    const badgeDinero        = document.querySelector( '#dinero span' ),
          fichasApuesta      = document.querySelectorAll( '#fichas a' ),
          badges             = document.querySelectorAll( '#fichas span' ),
          opcionesApuesta    = document.querySelectorAll( '#opciones-apuesta button' ),
          opcionesJuego      = document.querySelectorAll( '#opciones-juego button' ),
          jugadorCarta       = document.querySelector( '#jugador-cartas' ),
          computadoraCarta   = document.querySelector( '#computadora-cartas' ),
          tooltipTriggerList = document.querySelectorAll( '[data-bs-toggle="tooltip"]' ),
          tooltipList        = [...tooltipTriggerList].map(tooltipTriggerEl => 
                               new bootstrap.Tooltip( tooltipTriggerEl ));

    /* Crea y baraja las cartas */
    const crearMazo = () => {
        mazo = [];
        for ( let i = 2; i <= 10; i++ ) {
            for ( let tipo of tipos ) {
                mazo.push( i + tipo );
            }
        }

        for ( let figura of figuras ) {
            for ( let tipo of tipos ) {
                mazo.push( figura + tipo );
            }
        }

        /* Baraja el mazo de cartas */
        let i = mazo.length;
        while ( --i > 0 ) {
            let randIndex = Math.floor( Math.random() * ( i + 1 ) );
            [mazo[randIndex], mazo[i]] = [mazo[i], mazo[randIndex]];
        }
    };

    /* Selecciona la última carta del mazo */
    const pedirCarta = () => {
        if ( mazo.length === 0 ) { throw 'Lo siento, no hay mas cartas en el mazo.'; }
        return mazo.pop();
    };

    /* Devuelve el valor de la carta selleccionada 
        A => 1 ó 11
        J, K, Q => 10
        2C, 2D, 2H, 2S => 2         3C, 3D, 3H, 3S => 3         4C, 4D, 4H, 4S => 4
        5C, 5D, 5H, 5S => 5         6C, 6D, 6H, 6S => 6         7C, 7D, 7H, 7S => 7
        8C, 8D, 8H, 8S => 8         9C, 9D, 9H, 9S => 9
    */
    const valorCarta = ( intento, carta, puntaje ) => {
        const valor      = carta.substring(0, carta.length - 1);
        let   valorCarta = (!isNaN( valor )) ? valor * 1 : ( valor === 'A' ) ? 1 : 10;
    
        if (( intento == 2 && puntaje == 1 ) && valorCarta == 10) {
            valorCarta = 20;
        } else if (( intento == 2 && puntaje == 10 ) && valorCarta == 1) {
            valorCarta = 11;
        }

        return valorCarta;
    }

    /* Prepara el escenario para una nueva apuesta */
    const nuevaApuesta = ( saldoDinero ) => {
        crearMazo();
        const cartasJugador     = jugadorCarta.querySelectorAll( 'img' );
        const cartasComputadora = computadoraCarta.querySelectorAll( 'img' );
        dineroInicial           = saldoDinero;
        badgeDinero.innerText   = saldoDinero;

        if ( cartasJugador.length > 0 ) { cartasJugador.forEach(( carta ) => carta.remove()); }
        if ( cartasComputadora.length > 0 ) { cartasComputadora.forEach(( carta ) => carta.remove()); }
    };

    const mostrarMensajeFinRonda = () => {
        if ( dineroInicial === 0 ) {
            Swal.fire({
                icon: 'error',
                title: '¡Fin de la ronda!',
                text: 'Te has quedado sin dinero.',
                toast: true,
                position: 'bottom-end',
                confirmButtonText: 'Nueva ronda'
            }).then(( resultado ) => {
                if ( resultado.isConfirmed ) { onNuevaPartida(); }
            });
        }
    };

    const mostrarMensaje = ( icono, titulo, mensaje ) => {
        Swal.fire({
            icon: icono,
            title: titulo,
            text: mensaje,
            toast: true,
            position: 'bottom-end',
            confirmButtonText: 'Ok'
        }).then(( resultado ) => {
            if (resultado.isConfirmed && (icono.includes( 'success' ) || icono.includes( 'warning' ) || 
                icono.includes( 'error' ))) {
                onReiniciarApuesta();
                habilitarElementos( fichasApuesta );
                nuevaApuesta( dineroInicial );
                mostrarMensajeFinRonda();
            }
        });
    };

    const puntajesJugadores = ( turno, intento, carta ) => {
        puntosJugadores[ turno ] = puntosJugadores[ turno ] + 
                                   valorCarta( intento, carta, puntosJugadores[ turno ] );
    }

    /* Agrupa las cartas seleccionadas por el Jugador y calcula su puntaje respectivo */
    const turnoJugador = ( intento ) => {
        const carta = pedirCarta();
        puntajesJugadores( 0, intento, carta );
        const imagenCarta = document.createElement( 'img' );
        imagenCarta.src   = `./assets/images/${carta}.png`;
        imagenCarta.classList.add( 'shadow' );
        jugadorCarta.append( imagenCarta );

        if ( puntosJugadores[0] >= 21 ) { onDetenerPartida(); }
    };

    /* Agrupa las cartas seleccionadas por la Computadora y calcula su puntaje respectivo */
    const turnoComputadora = ( intento ) => {
        ultimaCarta = pedirCarta();
        puntajesJugadores( 1, intento, ultimaCarta );
        const imagenCarta = document.createElement( 'img' );

        ( intento === 2 )? imagenCarta.src = './assets/images/blue-back.png': 
                           imagenCarta.src = `./assets/images/${ultimaCarta}.png`
        
        imagenCarta.classList.add( 'shadow' );
        computadoraCarta.append( imagenCarta );
    };

    const habilitarElementos = ( elementos ) => {
        elementos.forEach(( elemento ) => elemento.classList.remove( 'disabled' ));
    }

    const deshabilitarElementos = ( elementos ) => {
        elementos.forEach(( elemento ) => elemento.classList.add( 'disabled' ));
    }

    /* Establece los valores iniciales para una apuesta */
    const onReiniciarApuesta = () => {
        for( let i = 0; i < totalFichas.length; i++ ) { totalFichas[ i ] = 0; }
        for( let i = 0; i < puntosJugadores.length; i++ ) { puntosJugadores[ i ] = 0; }
        badges.forEach(( badge ) => badge.innerText = 0);
    }

    const onRealizarApuesta = () => {
        if ( totalFichas[ 4 ] > 0 && totalFichas[ 4 ] <= dineroInicial ) {
            dineroInicial         = dineroInicial - totalFichas[ 4 ];
            badgeDinero.innerText = dineroInicial;
            for ( let intento = 1; intento <= 2; intento++ ) {
                turnoComputadora( intento );
                turnoJugador( intento );
            }
            deshabilitarElementos( fichasApuesta );
            deshabilitarElementos( opcionesApuesta );
            habilitarElementos( opcionesJuego );
        } else if ( totalFichas[ 4 ] === 0 ) {
            mostrarMensaje( 'info', '¡Uups...!', 'Para apostar primero debes comprar fichas.' );
        } else {
            mostrarMensaje( 'info', '¡Uups...!', 'No tienes suficiente dinero para comprar fichas.' );
        }
    };

    const onNuevaPartida = () => {
        onReiniciarApuesta();
        habilitarElementos( fichasApuesta );
        nuevaApuesta( dineroJugador );
        deshabilitarElementos( opcionesJuego );
    };

    const onDetenerPartida = () => {
        deshabilitarElementos( opcionesJuego );
        const cartas    = document.querySelectorAll( '#computadora-cartas img' );
        cartas[ 1 ].src = `./assets/images/${ultimaCarta}.png`;
        cartas[ 1 ].classList.add( 'shadow' );

        while ( puntosJugadores[ 1 ] <= 16 ) { turnoComputadora( 0 ); }
    
        if ( puntosJugadores[ 0 ] <= 21 && (puntosJugadores[ 0 ] > puntosJugadores[ 1 ] || 
            puntosJugadores[ 1 ] > 21) ) {
            mostrarMensaje( 'success', '¡Felicidades!', 'Ganaste la partida.' );
            dineroInicial = ( cartas.length === 2 && puntosJugadores[ 0 ] === 21 )?
            dineroInicial + ( totalFichas[ 4 ] * 2.5 ): dineroInicial + ( totalFichas[ 4 ] * 2 )
        } else if ( puntosJugadores[ 1 ] === puntosJugadores[ 0 ] ) {
            mostrarMensaje( 'warning', '¡Uups...!', 'No hay un ganador en la partida.' );
            dineroInicial = dineroInicial + totalFichas[ 4 ];
        } else {
            mostrarMensaje( 'error', '¡Lo siento!', 'Perdiste la partida.' );
        }
    };

    const mostrarTotalFichasApuesta = ( totalFicha, valorFicha, tagTotalFicha ) => {
        if ( totalFicha <= 5 ) {
            totalFichas[ 4 ]        = totalFichas[ 4 ] + valorFicha;
            tagTotalFicha.innerText = totalFicha;
            badges[ 4 ].innerText   = totalFichas[ 4 ];
        }

        if ( opcionesApuesta[ 0 ].classList.contains( 'disabled' ) && 
            opcionesApuesta[ 0 ].classList.contains( 'disabled' ) ) {
            habilitarElementos( opcionesApuesta );
        }
    };

    fichasApuesta[ 0 ].addEventListener('click', () => {
        totalFichas[ 0 ]++;
        mostrarTotalFichasApuesta( totalFichas[ 0 ], fichas[ 0 ], badges[ 0 ] );
    });

    fichasApuesta[ 1 ].addEventListener('click', () => {
        totalFichas[ 1 ]++;
        mostrarTotalFichasApuesta( totalFichas[ 1 ], fichas[ 1 ], badges[ 1 ] );
    });

    fichasApuesta[ 2 ].addEventListener('click', () => {
        totalFichas[ 2 ]++;
        mostrarTotalFichasApuesta( totalFichas[ 2 ], fichas[ 2 ], badges[ 2 ] );
    });

    fichasApuesta[ 3 ].addEventListener('click', () => {
        totalFichas[ 3 ]++;
        mostrarTotalFichasApuesta( totalFichas[ 3 ], fichas[ 3 ], badges[ 3 ] );
    });

    opcionesApuesta[ 0 ].addEventListener('click', () => {
        onReiniciarApuesta();
        deshabilitarElementos( opcionesApuesta );
    });

    opcionesApuesta[ 1 ].addEventListener('click', () => onRealizarApuesta());

    opcionesJuego[ 0 ].addEventListener('click', () => onNuevaPartida());

    opcionesJuego[ 1 ].addEventListener('click', () => turnoJugador( 0 ));

    opcionesJuego[ 2 ].addEventListener('click', () => onDetenerPartida());

    badgeDinero.innerText = dineroJugador;
    crearMazo();
})();