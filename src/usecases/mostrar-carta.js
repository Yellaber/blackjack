
/**
 * 
 * @param {Number} turno 
 * @param {Number} intento 
 * @param {String} carta 
 * @returns {HTMLImageElement}
 */
export const mostrarCarta = ( turno, intento, carta ) => {
    /*if ( !turno ) {
        throw new Error('El argumento turno es obligatorio y debe ser de tipo Number.');
    } else if ( turno < 0 || turno > 1 ) {
        throw new Error('El valor del argumento turno debe ser 0 o 1.');
    }*/

    const imagenCarta = document.createElement( 'img' );
    imagenCarta.src   = `./assets/images/${carta}.png`;
    
    if ( turno === 1 && intento === 2 ) {
        imagenCarta.src = './assets/images/blue-back.png';
    }
    
    imagenCarta.classList.add( 'shadow' );
    return imagenCarta;
};