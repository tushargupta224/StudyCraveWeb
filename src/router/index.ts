import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LandingView from "../views/LandingView.vue";
import PrivateChannel from '../views/PrivateChannel.vue';
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
      component: HomeView,
      meta: { requireAuth: true },
    },
    {
      path: "/private-channel",
      name: "private-channel",
      component: PrivateChannel,
      meta: { requireAuth: true },
    },
  ],
});

setUpAuthRouteGuard(router);

export default router;
