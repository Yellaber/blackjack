import { valorCarta } from './valor-carta'

/**
 * Calcula el puntaje de los jugadores.
 * @param {Number} puntosJugador Puntaje actual del jugador.
 * @param {Number} intento Número de veces que se la repartido carta al jugador.
 * @param {String} carta Carta que el jugador ha recibido en el actual intento.
 * @returns {Number} Retorna el nuevo puntaje del jugador.
 */
export const puntajesJugadores = ( puntosJugador, intento, carta ) => {
    /*if ( !puntosJugador )
        throw new Error('El parámetro puntosJugador es obligatorio y debe ser de tipo Number.');

    if ( !intento )
        throw new Error('El intento es un parámetro obligatorio y este debe ser de tipo Number.');

    if ( !carta )
        throw new Error('La carta es un parámetro obligatorio y este debe ser de tipo String.');*/

    return puntosJugador + valorCarta( intento, carta, puntosJugador );
};