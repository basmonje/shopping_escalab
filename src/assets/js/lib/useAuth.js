/**
 * Carrito de compras
 *
 * @author Bastian Monje
 */
import { observer } from "./useCart.js";

export default function Auth({ db, userLocal = {} }) {
  return Object.freeze({
    setUser,
    getUser,
    login,
    logout,
    isLogged,
  });

  /**
   * Añadir nuevo usuario
   *
   * @param {object} user
   * @returns {void}
   */
  function setUser(user) {
    db[user.id] = user;
    return;
  }

  /**
   * Conseguir datos de usuario registrado
   *
   * @returns {object} data
   */
  function getUser() {
    if (userLocal.name) {
      return Object.freeze({
        ...userLocal,
      });
    } else {
      return null;
    }
  }

  /**
   * Iniciar sesión
   *
   * @param {object} credencials
   * @returns {object}
   */
  function login(credencials) {
    // Login authentication
    const { email, password } = credencials;
    const user = Object.values(db).find((user) => email == user.email);

    if (!user) {
      return Object.freeze({
        success: false,
        message: "No existe usuario",
      });
    } else if (user.password != password) {
      return Object.freeze({
        success: false,
        message: "Contrasena incorrecta",
      });
    }

    userLocal = {
      auth: true,
      id: user.id,
      name: user.name,
      lastname: user.lastname,
    };

    observer.publish("update-cart", userLocal);
    return Object.freeze({
      success: true,
      message: "Inicio sesion correctamente",
    });
  }

  /**
   * Cerrar sesion
   */
  function logout() {
    userLocal = {};
    return;
  }

  /**
   * Verficiar si esta autenticado
   * 
   * @returns {boolean}
   */
  function isLogged() {
    if (!userLocal.auth) {
      return false;
    } else {
      return true;
    }
  }
}
