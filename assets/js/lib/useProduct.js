/**
 * Carrito de compras
 *
 * @author Bastian Monje
 */
import { observer } from "./useCart.js";

export default function useProducts({ db }) {
  return Object.freeze({
    add,
    addMany,
    decrementStock,
    incrementStock,
    get,
  });

  /**
   * Añadir nuevo producto
   *
   * @param {object}
   * @returns {void}
   */
  function add(product) {
    db[product.id] = product;
    return;
  }

  /**
   * Añadir lista de productos
   *
   * @param {array} productos lista de productos
   * @returns {void}
   */
  function addMany(products) {
    products.forEach((product) => add(product));
    observer.publish("update-cart", { msg: "addMany" });
    return;
  }

  /**
   * Disminuir stock de producto
   *
   * @param {string} id
   * @returns {void}
   */
  function decrementStock(id) {
    if (db[id]) {
      const { stock } = db[id];

      if (stock > 0) {
        add({
          ...db[id],
          stock: db[id].stock - 1,
        });

        return;
      }
    }
  }

  /**
   * Incrementar stock de producto
   *
   * @param {string} id
   * @param {number} value
   */
  function incrementStock(id, value = 1) {
    if (db[id]) {
      add({
        ...db[id],
        stock: db[id].stock + value,
      });

      return;
    }
  }

  /**
   * Conseguir lista de productos
   *
   * @returns {object}
   */
  function get() {
    return Object.freeze({ ...db });
  }
}
