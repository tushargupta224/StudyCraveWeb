import { defineStore } from "pinia";
import type { Phone } from "../types/Phone";
import type User from "../types/user";

export const useAuthStore = defineStore({
  id: "userAuth",
  state: () => ({
    user: null as User | null,
    authenticating: false,
    fetchingUser: false,
  }),
  getters: {
    isAuthenticated: (state) => {
      return state.user != null;
    },
  },
  actions: {
    // async login(phone: Phone, otpVerifiedToken: string) {
    //   try {
    //     this.authenticating = true;

    //     // Add LoginOtP Call

    //     localStorage.setItem("userId", this.user.id);
    //   } finally {
    //     this.authenticating = false;
    //   }
    // },
    async getUserData() {
      try {
        const userId = localStorage.getItem("userId");

        if (userId) {
          this.fetchingUser = true;

          // Call get user data api
        }
      } catch (e) {
        localStorage.removeItem("userId");
      } finally {
        this.fetchingUser = false;
      }
    },
  },
});
