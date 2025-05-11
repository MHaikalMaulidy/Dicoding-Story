import { postRegister } from "../../data/api";

export default class RegisterPage {
  async render() {
    return `
      <section class="login-container">
        <h1>Register</h1>
        <form id="registerForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password (min 8 characters)</label>
            <input type="password" id="password" minlength="8" required>
          </div>
          <button type="submit" class="login-button">Register</button>
        </form>
        <p class="register-link">Already have an account? <a href="#/login">Login here</a></p>
      </section>
    `;
  }

  async afterRender() {
    const registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await postRegister(name, email, password);

        if (response.error) {
          throw new Error(response.message);
        }

        alert("Registration successful!");
        window.location.hash = "#/login";
      } catch (error) {
        alert(error.message);
      }
    });
  }
}
