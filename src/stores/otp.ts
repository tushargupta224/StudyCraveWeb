import { defineStore } from "pinia";
import type { Phone } from "../types/Phone";

export const useOtpStore = defineStore({
  id: "otp",
  state: () => ({
    sendingOtp: false,
    otpSent: false,
    verifyingOtp: false,
    otpVerifiedToken: null as string | null,
    resendTimer: null as null | ReturnType<typeof setInterval>,
    resendWaitInSecs: 60,
  }),
  actions: {
    async sendOtp(phone: Phone) {
      this.sendingOtp = true;
      this.otpSent = false;
      this.clearResendTimer();

      try {
        this.resendTimer = setInterval(() => {
          if (this.resendWaitInSecs <= 1) {
            this.clearResendTimer();
          } else {
            this.resendWaitInSecs--;
          }
        }, 1000);

        // Send Otp Api Call
        this.otpSent = true;
      } finally {
        this.sendingOtp = false;
      }
    },
    async verifyOtp(phone: Phone, otp: string) {
      this.verifyingOtp = true;

      try {
        // Verify Otp Api Call
        // this.otpVerifiedToken = otpRes.otpVerifiedToken;
      } finally {
        this.verifyingOtp = false;
      }
    },

    clearResendTimer() {
      if (this.resendTimer) {
        this.resendWaitInSecs = 60;
        clearInterval(this.resendTimer);
        this.resendTimer = null;
      }
    },
  },
});
