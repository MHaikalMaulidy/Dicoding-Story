import { getStories } from "../data/api";

export default class HomePresenter {
  constructor(view) {
    this._view = view;
  }

  async loadStories() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.hash = "#/login";
        return;
      }

      const { listStory } = await getStories();
      console.log("ME", listStory);
      this._view.showStories(listStory);
    } catch (error) {
      this._view.showError("Failed to load stories. Please try again later.");
    }
  }
}
