import Component from "../utils/Component.js";
import { observer } from "../lib/useCart.js";
import { formatNumber } from "../utils/formatNumber.js";

export default class Sidebar extends Component {
  constructor(useProduct, useCart, useAuth) {
    super({
      observer,
      element: document.getElementById("sidebar"),
    });
    this._useProduct = useProduct;
    this._useCart = useCart;
    this._useAuth = useAuth;

    this.list = document.getElementById("list-cart");
    this.template = document.getElementById("template-card-cart").content;
    this.shorts = (selector) => this.template.querySelector(selector);
    this.fragment = document.createDocumentFragment();

    this.message = document.getElementById("message-cart");
    this.boxCheckout = document.getElementById("checkout");
    this.success = document.getElementById("success");
  }

  render() {
    let self = this;

    self.list.innerHTML = "";

    if (!self._useCart.get()) {
      return;
    }

    const cart = Object.values(self._useCart.get());

    if (cart.length === 0) {
      self.list.innerHTML = "<p class='flex p-1'>No hay nada en carro</p>";
      return;
    }

    cart.forEach((product) => {
      self.shorts("img").src = product.img;
      self.shorts(".title").textContent = product.title;
      self.shorts(".price").textContent = formatNumber.new(product.price, "$");

      self.shorts(".total").textContent = formatNumber.new(
        product.price * product.count,
        "$"
      );
      self.shorts(".sub-product").dataset.id = product.id;
      self.shorts(".add-product").dataset.id = product.id;
      self.shorts(".remove-product").dataset.id = product.id;
      self.shorts(".count-product").textContent = product.count;

      const clone = self.template.cloneNode(true);
      self.fragment.appendChild(clone);
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    self.list.appendChild(this.fragment);
  }

  listening(e) {
    let self = this;

    const handleOpenSidebar = (e) => {
      if (!e.target.matches(".btn-cart")) return;
      self.element.classList.toggle("open");
    };

    const handleCloseSidebar = (e) => {
      if (!e.target.matches(".close-sidebar")) return;
      self.element.classList.remove("open");
    };

    const handleAddItem = (e) => {
      if (!e.target.matches(".add-product")) return;
      const stock = self._useProduct.get()[e.target.dataset.id].stock;

      if (stock !== 0) {
        self._useCart.incrementItem(e.target.dataset.id);
      } else {
        self.message.textContent = "No hay mas items"
      }
    };

    const handleSubItem = (e) => {
      if (!e.target.matches(".sub-product")) return;

      const stock = self._useCart.get()[e.target.dataset.id].count;

      if (stock === 1) {
        self._useCart.remove(e.target.dataset.id);
        return;
      }
      self._useCart.decrementItem(e.target.dataset.id);
    };

    const handleDeleteItem = (e) => {
      if (!e.target.matches(".remove-product")) return;
      const stock = self._useCart.get();

      if (stock) {
        self._useCart.remove(e.target.dataset.id);
      }
    };

    const handleCheckout = (e) => {
      if (!e.target.matches(".btn-checkout")) return;

      const auth = self._useAuth.isLogged();

      if (!auth) {
        self.message.innerHTML = ``;
        login.classList.toggle("open");

        self.message.textContent = "Tienes que iniciar sesión";
      } else {
        self.message.textContent = "Autenticado";

        const cart = Object.values(self._useCart.get()).length;
        let cartEmpty = cart === 0 ? true : false;

        if (cartEmpty) {
          self.message.textContent = "El carro esta vacio";
        } else {
          self.boxCheckout.classList.toggle("open");
          setTimeout(() => {
            self.boxCheckout.classList.remove("open");
            self.element.classList.remove("open");

            self._useCart.clean();
            localStorage.removeItem("cart");
            self.success.classList.toggle("open");
          }, 3000);
        }
      }
    };

    const handleKeepBuying = (e) => {
      let self = this;
      if (!e.target.matches(".keep")) return;
      self.success.classList.remove("open");
    };

    handleOpenSidebar(e);
    handleCloseSidebar(e);

    handleAddItem(e);
    handleSubItem(e);
    handleDeleteItem(e);

    handleCheckout(e);
    handleKeepBuying(e);
  }
}
