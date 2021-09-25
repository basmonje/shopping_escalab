import Component from "../utils/Component.js";
import { observer } from "../lib/useCart.js";
import { formatNumber } from "../utils/formatNumber.js";

export default class Total extends Component {
  constructor(useCart, useAuth) {
    super({
      observer,
      element: document.getElementById("total"),
    });
    this._useCart = useCart;
    this._useAuth = useAuth;

    this.template = document.getElementById("template-total").content;
    this.shorts = (selector) => this.template.querySelector(selector);
    this.fragment = document.createDocumentFragment();
  }

  render() {
    let self = this;

    self.element.innerHTML = "";

    const cart = Object.values(self._useCart.get()).length;

    const values = self._useCart.values();
    const price = formatNumber.new(values.priceCount, "$");
    const shipping = formatNumber.new(values.shippingCost, "$");

    let totalValue = values.priceCount + values.shippingCost;
    if (cart === 0) {
      totalValue = "0";
    }

    const total = formatNumber.new(totalValue, "$");

    self.shorts(".total-products").textContent = price;
    self.shorts(".total-shipping").textContent = shipping;
    self.shorts(".total").textContent = total;

    const auth = self._useAuth.getUser();

    if (auth) {
      self.shorts(".btn-checkout").textContent = "Comprar";
    }

    const clone = self.template.cloneNode(true);
    self.fragment.appendChild(clone);
    self.element.appendChild(self.fragment);
  }
}
