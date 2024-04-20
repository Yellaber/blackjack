
/**
 * Devuelve el valor de una carta
 * A => 1 ó 11
      J, K, Q => 10
      2C, 2D, 2H, 2S => 2         3C, 3D, 3H, 3S => 3         4C, 4D, 4H, 4S => 4
      5C, 5D, 5H, 5S => 5         6C, 6D, 6H, 6S => 6         7C, 7D, 7H, 7S => 7
      8C, 8D, 8H, 8S => 8         9C, 9D, 9H, 9S => 9
 * @param {Number} intento Número de veces que se le ha repartido carta al jugador.
 * @param {String} carta Carta entregada al jugador.
 * @param {Number} puntaje Puntaje actual del jugador.
 * @returns {Number} Retorna el valor de la carta que recibió el jugador.
 */
export const valorCarta = ( intento, carta, puntaje ) => {
    /*if ( !intento )
        throw new Error('El intento es un parámetro obligatorio y este debe ser de tipo Number.');

    if ( !carta )
        throw new Error('La carta es un parámetro obligatorio y este debe ser de tipo String.');

    if ( !puntaje )
        throw new Error('El puntaje es un parámetro obligatorio y este debe ser de tipo Number.');*/

    const valor      = carta.substring(0, carta.length - 1);
    let   valorCarta = (!isNaN( valor )) ? valor * 1 : ( valor === 'A' ) ? 1 : 10;
    
    if (( intento == 2 && puntaje == 1 ) && valorCarta == 10) {
        valorCarta = 20;
    } else if (( intento == 2 && puntaje == 10 ) && valorCarta == 1) {
        valorCarta = 11;
    }
  
    return valorCarta;
};