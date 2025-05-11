// CSS imports
import "../styles/styles.css";
import "../styles/login.css";
import "../styles/register.css";
import "../styles/story-cards.css";
import "../styles/add-story.css";
import "../styles/detail.css";

import { setupLogout } from "./utils/logout";
import App from "./pages/app";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });

  setupLogout();
});
