/**
 * Carrito de compras
 *
 * @author Bastian Monje
 */

import Component from "../utils/Component.js";
import { observer } from "../lib/useCart.js";
import { formatNumber } from "../utils/formatNumber.js";

export default class Products extends Component {
  constructor(useProduct, useCart) {
    super({
      observer,
      element: document.getElementById("list-products"),
    });

    this._useProduct = useProduct;
    this._useCart = useCart;
    this.template = document.getElementById("template-card-product").content;
    this.shorts = (selector) => this.template.querySelector(selector);
    this.fragment = document.createDocumentFragment();

    this.countNavbar = document.getElementById("count-nav");
    this.countSidebar = document.getElementById("count-sidebar");
    this.sidebar = document.getElementById("sidebar");

    this.message = document.getElementById("message-cart");
  }

  render() {
    let self = this;

    self.element.innerHTML = "";

    if (!self._useProduct.get()) {
      return;
    }

    const products = Object.values(self._useProduct.get());

    if (products.length === 0) {
      self.element.innerHTML = `<p>Sin productos</p>`;
      return;
    }

    this.countNavbar.textContent = Object.values(self._useCart.get()).length;
    this.countSidebar.textContent = Object.values(self._useCart.get()).length;

    products.forEach((product) => {
      const inStock = self._useCart.get()[product.id];

      if (inStock || product.stock === 0) {
        this.shorts(".add-cart").textContent = "shopping_basket";
        this.shorts(".add-cart").disabled = true;
      } else {
        this.shorts(".add-cart").textContent = "add";
      }

      this.shorts("img").src = product.img;
      this.shorts(".title").textContent = product.title;
      this.shorts(".price").textContent = formatNumber.new(product.price, "$");
      this.shorts(".total-stock").textContent = product.stock;
      this.shorts(".add-cart").dataset.id = product.id;

      const clone = this.template.cloneNode(true);
      this.fragment.appendChild(clone);
    });

    localStorage.setItem("products", JSON.stringify(products));
    this.element.appendChild(this.fragment);
  }

  listening(e) {
    let self = this;

    const handleAddIntoCart = (e) => {
      if (!e.target.matches(".add-cart")) return;

      const inCart = self._useCart.get()[e.target.dataset.id];
      const product = self._useProduct.get()[e.target.dataset.id];

      if (inCart) {
        self.sidebar.classList.add("open");
        return;
      }

      if (product.stock === 0) {
        return;
      }

      self._useCart.add(e.target.dataset.id);
    };

    handleAddIntoCart(e);
  }
}
