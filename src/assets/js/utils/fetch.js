/**
 * Carrito de compras
 *
 * @author Bastian Monje
 */

/**
 * Traer productos desde archivo json
 * 
 * @returns {array} Lista con productos
 */
export async function fetchProduct() {
  const response = await fetch("items.json");

  if (!response.ok) {
    const message = `Ha ocurrido un error ${response.statusText}`;
    throw new Error(message);
  }

  const result = await response.json();
  return result;
}
