import LoginPresenter from "../../presenters/login-presenter";

export default class LoginPage {
  constructor() {
    this._presenter = new LoginPresenter(this);
  }

  async render() {
    return `
      <section class="login-container">
        <h1>Login</h1>
        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required>
          </div>
          <button type="submit" class="login-button">Login</button>
        </form>
        <p class="register-link">Don't Have account? <a href="#/register">Register here</a></p>
      </section>
    `;
  }

  async afterRender() {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      this._presenter.loginUser(email, password);
    });
  }

  showSuccess(message) {
    alert(message);
  }

  showError(message) {
    alert(message);
  }

  redirectToHome() {
    window.location.hash = "#/";
  }
}
