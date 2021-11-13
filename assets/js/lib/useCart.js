/**
 * Carrito de compras
 *
 * @author Bastian Monje
 */
import Observer from "../utils/obverser.js";

export const observer = new Observer();

export default function useCart(products, { db }) {
  return Object.freeze({
    add,
    get,
    incrementItem,
    decrementItem,
    remove,
    clean,
    restart,
    values,
  });

  /**
   * Añadir producto a carrito
   *
   * @param {string} id
   * @returns {object}
   */
  function add(id) {
    if (!products.get()[id]) {
      return Object.freeze({ success: false, message: "No existe producto" });
    } else {
      const stock = products.get()[id].stock;

      const product = {
        ...products.get()[id],
        count: 1,
      };

      products.decrementStock(id);

      if (db.hasOwnProperty(id)) {
        if (stock !== 0) {
          product.count = db[id].count + 1;
        } else {
          product.count = db[id].count;
        }
      }

      db[id] = product;
      observer.publish("update-cart", product);
      return Object.freeze({ success: true });
    }
  }

  /**
   * Incrementar cantidad de item en carrito
   *
   * @param {string} id
   * @param {number} value
   * @returns {object}
   */
  function incrementItem(id, value = 1) {
    if (!db[id]) {
      return Object.freeze({ success: false });
    } else {
      products.decrementStock(id);

      const product = {
        ...db[id],
      };

      if (db.hasOwnProperty(id)) {
        product.count = db[id].count + value;
      }

      db[id] = product;
      observer.publish("update-cart", product);
      return Object.freeze({ success: true });
    }
  }

  /**
   * Disminuir cantidad de item en carrito
   *
   * @param {string} id
   * @returns {object}
   */
  function decrementItem(id) {
    if (!db[id]) {
      return Object.freeze({ success: false });
    }

    if (db[id].count === 0) {
      return Object.freeze({ success: false, message: "Sin stock" });
    }

    if (db[id].count >= 0) {
      products.incrementStock(id);

      const newProduct = {
        ...db[id],
        count: db[id].count - 1,
      };

      db[id] = newProduct;
      observer.publish("update-cart", newProduct);
      return Object.freeze({ success: true });
    }
  }

  /**
   * Eliminar producto dentro del carrito
   *
   * @param {string} id
   * @returns {object}
   */
  function remove(id) {
    if (!db[id]) {
      return Object.freeze({ success: false });
    } else {
      products.incrementStock(id, db[id].count);

      if (localStorage.getItem("cart")) {
        localStorage.removeItem("cart");
      }

      delete db[id];
      observer.publish("update-cart", id);
      return Object.freeze({ success: true });
    }
  }

  /**
   * Limpiar todo el carrito de compras
   * @returns {void}
   */
  function clean() {
    db = {};
    observer.publish("update-cart", "delete");
    return;
  }

  /**
   * Ingresar contenido guardado en localstorage
   *
   * @param {array} items
   * @returns {void}
   */
  function restart(items) {
    items.forEach((item) => {
      const newProduct = {
        ...item,
        count: item.count,
      };

      db[item.id] = newProduct;
    });
    observer.publish("update-cart", "change");
    return;
  }

  /**
   * Genera contador de productos, contador de precios y costo de envío
   * 
   * @returns {object} 
   */
  function values() {
    const productsCount = Object.values(db).reduce(
      (acc, { count }) => acc + count,
      0
    );
    const priceCount = Object.values(db).reduce(
      (acc, { count, price }) => acc + count * price,
      0
    );

    const sValue = 1500;
    const pValue = 350;

    const shippingCost = productsCount * pValue + sValue;

    return Object.freeze({
      productsCount,
      priceCount,
      shippingCost,
    });
  }

  /**
   * Conseguir lista de productos en carrito
   * 
   * @returns {array} lista de productos
   */
  function get() {
    return Object.freeze({ ...db });
  }
}
