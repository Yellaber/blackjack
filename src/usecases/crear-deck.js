
/**
 * Crea y baraja el mazo de cartas.
 * @param {Array<String>} tipos Tipos de cartas. Ejemplo: [ 'C', 'D', 'H', 'S' ].
 * @param {Array<String>} figuras Figuras de la carta. Ejemplo: [ 'A', 'J', 'K', 'Q' ].
 * @returns {Array<String>} Retorna un nuevo mazo de cartas.
 */
export const crearMazo = ( tipos, figuras ) => {
    if ( !tipos || tipos.length === 0 ) 
        throw new Error('Tipos es obligatorio como un arreglo de String.');
    
    if ( !figuras || figuras.length === 0 ) 
        throw new Error('Figuras es obligatorio como un arreglo de String.');

    let mazo = [];

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

    return mazo;
};