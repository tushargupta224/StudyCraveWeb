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

      const requireAuth = to.matched.some((record) => record.meta.requireAuth);

      /// check if the route requires authentication
      if (requireAuth) {
        /// If user signed in previously, and data is not fetched yet
        if (!authStore.isAuthenticated && authStore.uid) {
          await authStore.getUserData(); //Fetch user data
        }
        if (authStore.isAuthenticated && authStore.hasSignedUp) {
          // check if user is authenticated and has signed up
          if (to.path === "/") {
            // if user is on the landing page
            next("/home"); // redirect them to /home
          } else {
            next(); // allow user to access the corresponding route
          }
        } else {
          // if user is not authenticated or has not signed up
          next("/"); // redirect them to the landing page
        }
      } else {
        // if the route doesn't require authentication
        if (
          to.path === "/" &&
          authStore.isAuthenticated &&
          authStore.hasSignedUp
        ) {
          // if user is on the home page and is authenticated and has signed up
          next("/home"); // redirect them to /home
        } else if (!authStore.isAuthenticated && authStore.uid) {
          await authStore.getUserData(); // fetch user details using the uid
          if (authStore.isAuthenticated && authStore.hasSignedUp) {
            // check if user is authenticated and has signed up
            if (to.path === "/") {
              // if user is on the home page
              next("/home"); // redirect them to /home
            } else {
              next(); // allow user to access the corresponding route
            }
          }
        } else {
          next(); // allow user to access the route
        }
      }
    }
  );
};
