import { createRouter, createWebHistory } from "vue-router";
import { setUpAuthRouteGuard } from "./authGuard";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: () => import("../views/LandingView.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: { requireAuth: true },
    },
    {
      path: "/channel/:channelId",
      name: "channel",
      component: () => import("../views/ChannelView.vue"),
      meta: { requireAuth: true },
    },
    {
      path: "/private-channel",
      name: "private-channel",
      component: () => import("../views/PrivateChannel.vue"),
      meta: { requireAuth: true },
    },
    {
      path: "/youtube-recommendation",
      name: "youtube-recommendation",
      component: () => import("../views/YoutubeRecommendation.vue"),
      meta: { requireAuth: true },
    },
  ],
});

setUpAuthRouteGuard(router);

export default router;
