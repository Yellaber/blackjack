
/**
 * Selecciona la última carta del mazo.
 * @param {Array<String>} mazo Mazo de cartas
 * @returns {String} Retorna la última carta del mazo.
 */
export const pedirCarta = ( mazo ) => {
    if ( !mazo || mazo.length === 0 ) 
        throw 'Lo siento, no hay cartas en el mazo.';
    
    return mazo.pop();
};