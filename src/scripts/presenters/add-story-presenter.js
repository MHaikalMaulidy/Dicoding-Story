import { postStory } from "../data/api";

export default class AddStoryPresenter {
  constructor(view) {
    this._view = view;
  }

  async presenterPostStory(storyData) {
    try {
      if (typeof storyData.photo === "string") {
        const response = await fetch(storyData.photo);
        storyData.photo = await response.blob();
      }

      const response = await postStory(storyData);

      if (response.error) {
        throw new Error(response.message);
      }

      this._view.showSuccess("Story added successfully!");
    } catch (error) {
      this._view.showError(error.message);
    }
  }
}
