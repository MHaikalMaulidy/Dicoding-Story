import { openDB } from "idb";

const DATABASE_NAME = "myapp";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "saved-stories";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade: (database) => {
    database.createObjectStore(OBJECT_STORE_NAME, {
      keyPath: "id",
    });
  },
});

const Database = {
  async putStory(story) {
    if (!Object.hasOwn(story, "id")) {
      throw new Error("`id` is required to save.");
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  async getStoryById(id) {
    if (!id) {
      throw new Error("`id` is required.");
    }
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async removeStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },

  async clearStories() {
    const tx = (await dbPromise).transaction(OBJECT_STORE_NAME, "readwrite");
    await tx.store.clear();
    await tx.done;
    return true;
  },

  async putStories(stories) {
    if (!Array.isArray(stories)) {
      throw new Error("Expected an array of stories");
    }
    const tx = (await dbPromise).transaction(OBJECT_STORE_NAME, "readwrite");
    const promises = stories.map((story) => {
      if (!story.id) throw new Error("Each story must have an id");
      return tx.store.put(story);
    });
    await Promise.all([...promises, tx.done]);
    return stories.length;
  },
};

export default Database;
