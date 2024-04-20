import { crearMazo, pedirCarta, puntajesJugadores, mostrarCarta, habilitarElementos } from './usecases';

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

    /* Prepara el escenario para una nueva apuesta */
    const nuevaApuesta = ( saldoDinero ) => {
        mazo                    = crearMazo( tipos, figuras );
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
                habilitarElementos( fichasApuesta, true );
                nuevaApuesta( dineroInicial );
                mostrarMensajeFinRonda();
            }
        });
    };

    /* Agrupa las cartas seleccionadas por el Jugador y calcula su puntaje respectivo */
    const turnoJugador = ( intento ) => {
        const carta          = pedirCarta( mazo );
        puntosJugadores[ 0 ] = puntajesJugadores( puntosJugadores[ 0 ], intento, carta );
        const imagenCarta    = mostrarCarta( 0, intento, carta );
        jugadorCarta.append( imagenCarta );

        if ( puntosJugadores[ 0 ] >= 21 ) { onDetenerPartida(); }
    };

    /* Agrupa las cartas seleccionadas por la Computadora y calcula su puntaje respectivo */
    const turnoComputadora = ( intento ) => {
        ultimaCarta          = pedirCarta( mazo );
        puntosJugadores[ 1 ] = puntajesJugadores( puntosJugadores[ 1 ], intento, ultimaCarta );
        const imagenCarta    = mostrarCarta( 1, intento, ultimaCarta );
        computadoraCarta.append( imagenCarta );
    };

    /* Establece los valores iniciales para una apuesta */
    const onReiniciarApuesta = () => {
        for( let i = 0; i < totalFichas.length; i++ ) { totalFichas[ i ] = 0; }
        for( let i = 0; i < puntosJugadores.length; i++ ) { puntosJugadores[ i ] = 0; }
        badges.forEach(( badge ) => badge.innerText = 0);
    };

    const onRealizarApuesta = () => {
        if ( totalFichas[ 4 ] > 0 && totalFichas[ 4 ] <= dineroInicial ) {
            dineroInicial         = dineroInicial - totalFichas[ 4 ];
            badgeDinero.innerText = dineroInicial;
            for ( let intento = 1; intento <= 2; intento++ ) {
                turnoComputadora( intento );
                turnoJugador( intento );
            }
            habilitarElementos( fichasApuesta, false );
            habilitarElementos( opcionesApuesta, false );
            habilitarElementos( opcionesJuego, true );
        } else if ( totalFichas[ 4 ] === 0 ) {
            mostrarMensaje( 'info', '¡Uups...!', 'Para apostar primero debes comprar fichas.' );
        } else {
            mostrarMensaje( 'info', '¡Uups...!', 'No tienes suficiente dinero para comprar fichas.' );
        }
    };

    const onNuevaPartida = () => {
        onReiniciarApuesta();
        habilitarElementos( fichasApuesta, true );
        nuevaApuesta( dineroJugador );
        habilitarElementos( opcionesJuego, false );
    };

    const onDetenerPartida = () => {
        habilitarElementos( opcionesJuego, false );
        const cartas    = document.querySelectorAll( '#computadora-cartas img' );
        cartas[ 1 ].src = `./assets/images/${ ultimaCarta }.png`;
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
            habilitarElementos( opcionesApuesta, true );
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
        habilitarElementos( opcionesApuesta, false );
    });

    opcionesApuesta[ 1 ].addEventListener('click', () => onRealizarApuesta());

    opcionesJuego[ 0 ].addEventListener('click', () => onNuevaPartida());

    opcionesJuego[ 1 ].addEventListener('click', () => turnoJugador( 0 ));

    opcionesJuego[ 2 ].addEventListener('click', () => onDetenerPartida());

    badgeDinero.innerText = dineroJugador;
    mazo                  = crearMazo( tipos, figuras );
})();
