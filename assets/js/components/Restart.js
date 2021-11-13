import Component from "../utils/Component.js";
import { observer } from "../lib/useCart.js";
import { fetchProduct } from "../utils/fetch.js";

export default class Restart extends Component {
  constructor(useProduct, useCart) {
    super({
      observer,
    });
    this._useProduct = useProduct;
    this._useCart = useCart;
  }

  async listening(e) {
    if (!e.target.matches(".btn-restart")) return;
    let self = this;

    if (localStorage.getItem("products")) {
      localStorage.removeItem("products");
    }

    const response = await fetchProduct();

    if (response) {
      self._useProduct.addMany(response);
    }

    if (localStorage.getItem("cart")) {
      localStorage.removeItem("cart");
    }

    self._useCart.clean();
  }
}
