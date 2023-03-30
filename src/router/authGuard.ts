import type {
  RouteLocationNormalized,
  NavigationGuardNext,
  Router,
} from "vue-router";
import { useAuthStore } from "../stores/auth";

export const setUpAuthRouteGuard = async function (router: Router) {
  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const authStore = useAuthStore();
      const isAuthenticated = authStore.isAuthenticated;

      const requireAuth = to.matched.some((record) => record.meta.requireAuth);

      if (requireAuth) {
        if (!isAuthenticated) {
          //fetch the user data
          await authStore.getUserData();
        }

        if (authStore.isAuthenticated) {
          next();
        } else {
          next("/");
        }
      } else {
        next();
      }
    }
  );
};
