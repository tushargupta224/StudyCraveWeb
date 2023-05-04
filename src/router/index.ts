import { createRouter, createWebHistory } from "vue-router";
import LandingView from "../views/LandingView.vue";
import PrivateChannel from "../views/PrivateChannel.vue";
import YoutubeRecommendation from "../views/YoutubeRecommendation.vue";
import YoutubeVideo from '../views/YoutubeVideo.vue';

import { setUpAuthRouteGuard } from "./authGuard";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: LandingView,
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
      component: PrivateChannel,
      meta: { requireAuth: true },
    },
    {
      path: "/youtube-recommendation",
      name: "youtube-recommendation",
      component: YoutubeRecommendation,
      meta: { requireAuth: true },
    },
    {
      path: "/youtube-Video",
      name: "youtube-Video",
      component: YoutubeVideo,
      meta: { requireAuth: true },
    },
  ],
});

setUpAuthRouteGuard(router);

export default router;
