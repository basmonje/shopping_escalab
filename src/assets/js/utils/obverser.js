/**
 * Observador de carrito de compras
 *
 * @author Bastian Monje
 */

export default class Observer {
  constructor() {
    this.events = {};
  }

  /**
   * Escuchar los cambios realizados
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
   * Si el evento tiene callbacks recorra cada uno
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
