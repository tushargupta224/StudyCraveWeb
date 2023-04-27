import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
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
      component: HomeView,
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
