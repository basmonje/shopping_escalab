/**
 * Carrito de compras
 *
 * @author Bastian Monje
 */

export default class Login {
  constructor(useAuth) {
    this._useAuth = useAuth;
    this.element = document.getElementById("login");
    this.menu = document.getElementById("menu-auth");
    this.message = document.getElementById("message-cart");

    this.messageLogin = document.querySelector(".message-login");
  }

  /**
   * Escuchar eventos
   *
   * @param {object} e
   */
  listener(e) {
    const handleOpenLogin = (e) => {
      if (!e.target.matches(".btn-login")) return;
      this.element.classList.toggle("open");
    };

    const handleCloseLogin = (e) => {
      if (!e.target.matches(".close-login")) return;

      this.element.classList.remove("open");
    };
    handleOpenLogin(e);
    handleCloseLogin(e);
  }

  render() {}

  /**
   * Autenticacion de usuario
   *
   * @param {object} e
   */
  authentication(e) {
    const email = e.target["0"].value;
    const password = e.target["1"].value;

    if (email != "" && password != "") {
      const isLogged = this._useAuth.login({ email, password });

      if (isLogged.success) {
        this.message.textContent = "Has iniciado sesion";
        this.element.classList.remove("open");
        this.menu.querySelector(".box-btn-auth").classList.toggle("hidden");
        this.menu.querySelector(".user").classList.toggle("visible");

        const user = this._useAuth.getUser();
        this.menu.querySelector(
          ".name"
        ).textContent = `${user.name} ${user.lastname}`;
      } else {
        this.messageLogin.textContent = isLogged.message;
      }
    } else {
      this.messageLogin.textContent = "Datos incorrectos";
    }
  }
}
