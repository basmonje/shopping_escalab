/**
 * Carrito de compras
 *
 * @author Bastian Monje
 */

export default class Observer {
  constructor() {
    this.events = {};
  }

  /**
   * Para escuchar los cambios realizados en el carrito
   *
   * @param {string} event
   * @param {function} callback
   * @returns {number} un contador de callbacks para este evento
   */
  subscribe(event, callback) {
    let self = this;

    // Si no existe un evento con este nombre
    if (!self.events.hasOwnProperty(event)) {
      self.events[event] = [];
    }

    return self.events[event].push(callback);
  }

  /**
   * Si el evento tiene callback recorra cada uno y llámarlo
   *
   * @param {*} event
   * @param {*} [data={}]
   * @returns {Array} el callback para este evento, o un array vacío si no existe el evento
   */
  publish(event, data = {}) {
    let self = this;

    if (!self.events.hasOwnProperty(event)) {
      return [];
    }

    return self.events[event].map((callback) => callback(data));
  }
}
