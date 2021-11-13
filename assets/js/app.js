/**
 * Carrito de compras
 *
 * @author Bastian Monje
 */

// Utils
import useProduct from "./lib/useProduct.js";
import useCart from "./lib/useCart.js";
import useAuth from "./lib/useAuth.js";

// Components
import ProductComponent from "./components/Products.js";
import SidebarComponent from "./components/Sidebar.js";
import LoginComponent from "./components/Login.js";
import RestartComponent from "./components/Restart.js";
import TotalComponent from "./components/Total.js";

// Fetch
import { fetchProduct } from "./utils/fetch.js";

export class App {
  constructor() {
    // Core
    this._auth = useAuth({ db: {} });
    this._product = useProduct({ db: {} });
    this._cart = useCart(this._product, { db: {} });

    // Components
    this.total = new TotalComponent(this._cart, this._auth);
    this.restart = new RestartComponent(this._product, this._cart);
    this.login = new LoginComponent(this._auth);
    this.sidebar = new SidebarComponent(this._product, this._cart, this._auth);
    this.products = new ProductComponent(this._product, this._cart);

    // Set test user
    this._auth.setUser({
      id: Date.now(),
      email: "client@compra.cl",
      password: "123456",
      name: "Robert",
      lastname: "Reyes",
    });
  }

  /**
   * Inicializar aplicación
   *
   * @returns {void}
   */
  init() {
    this.render();
    this.listen();
  }

  /**
   * Cargador de contenido
   * Carga productos guardados en localstorage
   * Carga items del carrito guardados en localstorage
   *
   * @returns {void}
   */
  async load() {
    // load products from localstorage
    const products = JSON.parse(localStorage.getItem("products"));

    // If we have products from the localstorage and
    // the quantity of products is different from zero
    // add all products
    if (products && products.length !== 0) {
      this._product.addMany(products);
    } else {
      // otherwise we will add the default products from our
      // `item.json` file
      try {
        const response = await fetchProduct();
        if (response) this._product.addMany(response);
      } catch (error) {
        console.error(error.message);
      }
    }

    // load cart items
    const shopping = JSON.parse(localStorage.getItem("cart"));

    if (shopping) {
      this._cart.restart(shopping);
    }
  }

  /**
   * Manejador de eventos
   *
   * @returns {void}
   */
  listen() {
    // Login form, handling of authentication
    document.getElementById("form-login").addEventListener("submit", (e) => {
      e.preventDefault();
      this.login.authentication(e);
    });

    // Event handler for all components
    document.addEventListener("click", async (e) => {
      await this.restart.listening(e);
      this.sidebar.listening(e);
      this.products.listening(e);
      this.login.listener(e);
    });
  }

  /**
   * Renderizar componentes
   * 
   * @returns {void}
   */
  render() {
    this.products.render();
    this.sidebar.render();
    this.total.render();
  }
}
