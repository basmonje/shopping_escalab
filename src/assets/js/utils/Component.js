/**
 * Carrito de compras
 *
 * @author Bastian Monje
 */

export default class Component {
  constructor(props = {}) {
    let self = this;

    // Configurar función vacio por defecto para que nada se rompa
    this.render = this.render || function () {};

    // Si hay un observador, nos subscribimos al cambio del carrito
    // y renderizamos
    if (props.hasOwnProperty("observer")) {
      props.observer.subscribe("update-cart", () => self.render());
    }

    // Almacenar el elemento HTML para adjuntar
    // el renderizado si está configurado
    if (props.hasOwnProperty("element")) {
      this.element = props.element;
    }
  }
}
