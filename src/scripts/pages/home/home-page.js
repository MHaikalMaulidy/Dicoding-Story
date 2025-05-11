import HomePresenter from "../../presenters/home-presenter";
import { showFormattedDate } from "../../utils";
import "leaflet/dist/leaflet.css";

export default class HomePage {
  constructor() {
    this._presenter = new HomePresenter(this);
  }

  async render() {
    return `
      <section class="container">
        <a href="#stories" class="skip-link" tabindex="1">Skip to content</a>
        <div id="stories" tabindex="-1"></div>
      </section>
    `;
  }

  async afterRender() {
    this._storiesContainer = document.getElementById("stories");
    this._presenter.loadStories();
  }

  showStories(stories) {
    this._storiesContainer.innerHTML = `
      <div class="story-grid" role="list">
        ${stories
          .map(
            (story) => `
          <article class="story-card" role="listitem">
            <div class="card-image">
              <img src="${story.photoUrl}" 
                   alt="Story photo by ${
                     story.name
                   }: ${story.description.substring(0, 50)}..." 
                   loading="lazy">
            </div>
            <div class="card-content">
              <h3 class="card-title">${story.name}</h3>
              <p class="card-text">${story.description}</p>
              <div class="card-footer">
                <time datetime="${story.createdAt}">${showFormattedDate(
              story.createdAt
            )}</time>
                <a href="#/detail/${
                  story.id
                }" class="detail-link">View Details</a>
              </div>
            </div>
          </article>
        `
          )
          .join("")}
      </div>
    `;
  }

  showError(message) {
    this._storiesContainer.innerHTML = `<p class="error">${message}</p>`;
  }
}
