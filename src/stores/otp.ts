import { defineStore } from "pinia";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
  type User,
} from "firebase/auth";
import { auth } from "../config/firebase";

export const useOtpStore = defineStore({
  id: "otp",
  state: () => ({
    sendingOtp: false,
    otpSent: false,
    verifyingOtp: false,
    resendTimer: null as null | ReturnType<typeof setInterval>,
    resendWaitInSecs: 60,
    reCaptchaVerifier: null as any,
    confirmationResult: null as ConfirmationResult | null,
  }),
  actions: {
    async sendOtp(phoneCountryCode: string, phoneNumber: string) {
      this.reCaptchaVerifier = new RecaptchaVerifier(
        "otp-send-button",
        {
          size: "invisible",
        },
        auth
      );

      if (this.reCaptchaVerifier)
        this.sendOtpForVerification(phoneCountryCode, phoneNumber);
    },
    async sendOtpForVerification(
      phoneCountryCode: string,
      phoneNumber: string
    ): Promise<void> {
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

        signInWithPhoneNumber(
          auth,
          "+" + phoneCountryCode + phoneNumber,
          this.reCaptchaVerifier
        )
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            this.confirmationResult = confirmationResult;
            this.otpSent = true;
            // ...
          })
          .catch((error) => {
            this.otpSent = false;
            throw Error("Something went wrong while sending OTP");
          });
      } finally {
        this.sendingOtp = false;
      }
    },
    async verifyOtp(otp: string): Promise<User> {
      this.verifyingOtp = true;

      if (!this.confirmationResult) {
        throw Error("");
      }

      return this.confirmationResult
        ?.confirm(otp)
        .then((result) => {
          this.verifyingOtp = false;
          return result.user;
        })
        .catch((error) => {
          throw error;
        });
    },

    clearResendTimer() {
      if (this.resendTimer) {
        this.resendWaitInSecs = 60;
        clearInterval(this.resendTimer);
        this.resendTimer = null;
      }
    },

    resetStates() {
      this.sendingOtp = false;
      this.otpSent = false;
      this.verifyingOtp = false;
      this.resendTimer = null;
      this.resendWaitInSecs = 60;
      this.reCaptchaVerifier = null;
      this.confirmationResult = null;
    },
  },
});
