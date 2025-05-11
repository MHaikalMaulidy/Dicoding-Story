import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import CONFIG from "./config";

const APP_SHELL = [
  "/",
  "/index.html",
  "/scripts/index.js",
  "/styles/styles.css",
  "/styles/detail.css",
  "/styles/story-cards.css",
  "/manifest.json",
  "/favicon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

const DYNAMIC_CACHE = "dynamic-content-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("app-shell").then((cache) => cache.addAll(APP_SHELL))
  );
});

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== "image";
  },
  new NetworkFirst({
    cacheName: "mystory-api",
  })
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination === "image";
  },
  new StaleWhileRevalidate({
    cacheName: "app-api-images",
  })
);

registerRoute(
  ({ url }) => {
    return url.origin.includes("maptiler");
  },
  new CacheFirst({
    cacheName: "maptiler-api",
  })
);

self.addEventListener("push", (event) => {
  console.log("Service worker pushing...");

  async function chainPromise() {
    const data = await event.data.json();
    await self.registration.showNotification(data.title, {
      body: data.options.body,
    });
  }

  event.waitUntil(chainPromise());
});

registerRoute(
  ({ request }) => request.url.includes("/api/"),
  new NetworkFirst({
    cacheName: DYNAMIC_CACHE,
  })
);
