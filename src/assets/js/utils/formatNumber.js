/**
 * Carrito de compras
 *
 * @author Bastian Monje
 */

/**
 * Formateador de valores, separa los números con puntos.
 * 
 */
export const formatNumber = {
  separador: ".",
  sepDecimal: ",",
  format: function (num) {
    num += "";
    const splitStr = num.split(".");
    let splitLeft = splitStr[0];
    let splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : "";
    const regx = /(\d+)(\d{3})/;

    while (regx.test(splitLeft)) {
      splitLeft = splitLeft.replace(regx, "$1" + this.separador + "$2");
    }

    return this.simbol + splitLeft + splitRight;
  },
  new: function (num, simbol) {
    this.simbol = simbol || "";
    return this.format(num);
  },
};
