import CONFIG from "../config";
import Database from "../database";

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}/v1`,
};

export async function getStories() {
  try {
    const fetchResponse = await fetch(ENDPOINTS.ENDPOINT + "/stories", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const { listStory } = await fetchResponse.json();

    // Save to IndexedDB when online
    if (listStory) {
      await Database.clearStories();
      await Database.putStories(listStory);
    }

    return { listStory };
  } catch (error) {
    console.error("Online fetch failed, trying offline:", error);
    const cachedStories = await Database.getAllStories();
    console.log(cachedStories, "okee");
    return { listStory: cachedStories || [] };
  }
}

export async function getStory(id) {
  try {
    const fetchResponse = await fetch(ENDPOINTS.ENDPOINT + `/stories/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const { story } = await fetchResponse.json();

    // Cache single story
    if (story) {
      await Database.putStory(story);
    }

    return { story };
  } catch (error) {
    console.error("Online fetch failed, trying offline:", error);
    const cachedStory = await Database.getStoryById(id);
    return { story: cachedStory || null };
  }
}

export async function postLogin(email, password) {
  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  return await fetchResponse.json();
}

export async function postRegister(name, email, password) {
  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
  return await fetchResponse.json();
}

export async function postStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("description", description);
  formData.append("lat", lat);
  formData.append("lon", lon);

  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT + "/stories", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });
  return await fetchResponse.json();
}

export async function subscribePushNotification({
  endpoint,
  keys: { p256dh, auth },
}) {
  const url = `${ENDPOINTS.ENDPOINT}/notifications/subscribe`;

  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const url = `${ENDPOINTS.ENDPOINT}/notifications/subscribe`;

  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
