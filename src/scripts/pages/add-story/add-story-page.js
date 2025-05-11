import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AddStoryPresenter from "../../presenters/add-story-presenter";

export default class AddStoryPage {
  constructor() {
    this._presenter = new AddStoryPresenter(this);
    this._map = null;
    this._marker = null;
    this._photoUrl = null;
    this._photoFile = null;
    this._mediaStream = null;
    this._coordinates = null;
    this._cleanup = this._cleanup.bind(this);

    window.addEventListener("unload", this._cleanup);
  }

  async render() {
    return `
      <section class="container">
        <h1>Add New Story</h1>
        <form id="storyForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" required></textarea>
          </div>
          <div class="form-group">
            <label>Photo</label>
            <div class="photo-preview" id="photoPreview"></div>
            <button type="button" id="takePhoto">Take Photo</button>
            <input type="file" id="photoInput" accept="image/*" capture="environment" style="display:none">
          </div>
          <div class="form-group">
            <label>Location</label>
            <div id="map" class="add-story-map"></div>
            <div class="coordinates">
              <span id="coordinates">Click on map to set location</span>
            </div>
          </div>
          <button type="submit" class="login-button">Submit</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "#/login";
      return;
    }
    this._initMap();
    this._setupCamera();
    this._setupForm();
    window.addEventListener("beforeunload", this._cleanup);
    window.addEventListener("hashchange", this._cleanup);
  }

  _cleanup() {
    try {
      if (this._mediaStream) {
        this._mediaStream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });

        const video = document.getElementById("cameraPreview");
        if (video) {
          video.srcObject = null;
        }
        this._mediaStream = null;
      }
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }

  _setupCamera() {
    const takePhotoBtn = document.getElementById("takePhoto");
    const photoInput = document.getElementById("photoInput");
    const photoPreview = document.getElementById("photoPreview");

    takePhotoBtn.addEventListener("click", async () => {
      try {
        this._cleanup();

        this._mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        photoPreview.innerHTML = `
         <div class="photo-preview">
          <video id="cameraPreview" autoplay playsinline></video>
          <button id="captureBtn" type="button" class="capture-button">Capture Photo</button>
          </div>
        `;

        const video = document.getElementById("cameraPreview");
        video.srcObject = this._mediaStream;

        document.getElementById("captureBtn").addEventListener("click", () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext("2d").drawImage(video, 0, 0);

          canvas.toBlob((blob) => {
            this._photoFile = blob;
            this._photoUrl = URL.createObjectURL(blob);
            photoPreview.innerHTML = `<img src="${this._photoUrl}" alt="Preview" style="max-width: 100%">`;
            this._cleanup();
          }, "image/jpeg");
        });
      } catch (error) {
        console.error("Camera error:", error);
        photoInput.click();
      }
    });

    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        this._photoFile = file;
        this._photoUrl = URL.createObjectURL(file);
        photoPreview.innerHTML = `<img src="${this._photoUrl}" alt="Preview" style="max-width: 100%">`;
      }
    });
  }

  _initMap() {
    this._map = L.map("map").setView([-2.5489, 118.0149], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    this._map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      document.getElementById("coordinates").textContent = `Lat: ${lat.toFixed(
        4
      )}, Lng: ${lng.toFixed(4)}`;

      if (this._marker) {
        this._map.removeLayer(this._marker);
      }
      this._marker = L.marker([lat, lng]).addTo(this._map);
      this._coordinates = { lat, lon: lng };
    });
  }

  _setupForm() {
    const form = document.getElementById("storyForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      this._cleanup();
      const name = document.getElementById("name").value;
      const description = document.getElementById("description").value;

      this._presenter.presenterPostStory({
        name,
        description,
        photo: this._photoUrl,
        ...this._coordinates,
      });
    });
  }

  showSuccess(message) {
    alert(message);
    window.location.hash = "#/";
  }

  showError(message) {
    alert(`Error: ${message}`);
  }
}
