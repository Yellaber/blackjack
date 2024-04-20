
/**
 * Habilita o deshabilita una lista de elementos HTML.
 * @param {Array<HTMLElement>} elementos Arreglo de elementos HTML.
 * @param {Boolean} bandera Indica si el elemento es habilitado o no. Este parámetro toma dos valores: true o 
 *                          false.
 */
export const habilitarElementos = ( elementos, bandera ) => {
    ( bandera )? elementos.forEach(( elemento ) => elemento.classList.remove( 'disabled' )):
                 elementos.forEach(( elemento ) => elemento.classList.add( 'disabled' ));
};