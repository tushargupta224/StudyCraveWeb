import { createRouter, createWebHistory } from "vue-router";
import LandingView from "../views/LandingView.vue";
import { setUpAuthRouteGuard } from "./authGuard";
// import NProgress from 'nprogress';

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
  ],
});

setUpAuthRouteGuard(router);

// router.beforeEach(()=>{
//   NProgress.start()
// })

// router.afterEach(()=>{
//   NProgress.done()
// })
export default router;
