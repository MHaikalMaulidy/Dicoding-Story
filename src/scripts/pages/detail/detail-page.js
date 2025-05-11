import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DetailPresenter from "../../presenters/detail-presenter";

export default class DetailPage {
  constructor() {
    this._presenter = new DetailPresenter(this);
    this._story = null;
  }

  async render(params) {
    if (!params || !params.id) {
      window.location.hash = "#/";
      return "<div>Redirecting...</div>";
    }

    await this._presenter.loadStory(params.id);
    return this._getContent();
  }

  showStory(story) {
    this._story = story;
  }

  async afterRender() {
    if (this._story?.lat && this._story?.lon) {
      this._initMap();
    }
  }

  showError(message) {
    console.error("Failed to load story:", message);
  }

  _getContent() {
    if (!this._story) return "<div>Loading...</div>";

    return `
      <section class="container">
        <div class="detail-header">
          <h1>${this._story.name}</h1>
          <a href="#/" class="back-link">← Back to Stories</a>
        </div>
        <div class="detail-content">
          <img src="${this._story.photoUrl}" alt="${this._story.name}'s story">
          <p>${this._story.description}</p>
          <div id="map" class="detail-map"></div>
        </div>
      </section>
    `;
  }

  _initMap() {
    if (!this._story.lat || !this._story.lon) return;

    const map = L.map("map").setView([this._story.lat, this._story.lon], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([this._story.lat, this._story.lon]).addTo(map);
    marker.bindPopup(`
      <div class="map-popup">
        <h3>${this._story.name}</h3>
        <img src="${this._story.photoUrl}" width="200"><br>
        <p><strong>Description:</strong> ${this._story.description}</p>
        <p><strong>Location:</strong><br>
        Latitude: ${this._story.lat.toFixed(6)}<br>
        Longitude: ${this._story.lon.toFixed(6)}</p>
        <small>Click outside to close</small>
      </div>
    `);
  }
}
