/**
 * Carrito de compras
 * 
 * @author Bastian Monje
 */

import { App } from "./assets/js/app.js";

const app = new App();

document.addEventListener("DOMContentLoaded", async (e) => {
  await app.load();
  app.init();
});
