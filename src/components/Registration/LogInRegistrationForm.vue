<template>
  <n-card
    style="width: 600px"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
    class="modal"
    :title="title"
    closable
    @close="handleCloseModal"
  >
    <n-message-provider>
      <XyzTransition appear mode="out-in">
        <Loading v-if="otpStore.sendingOtp || otpStore.verifyingOtp">
          <template v-slot:body>
            <div class="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </template>
        </Loading>
        <div
          xyz="fade right-80%"
          v-if="showPhoneInput && !isAuthenticated"
          class="heading"
        >
          <PhoneNumberInput
            @onSubmit="onSubmitPhoneNumber"
            :phoneNumber="phoneNumber"
            :title="isSignUp ? 'Create your account.' : 'Welcome back'"
            :sub-title="
              !isSignUp
                ? 'Enter the registered phone number to login.'
                : 'Enter phone number to start registration process.'
            "
          />
        </div>
        <div xyz="fade left-80%" v-if="!showPhoneInput && !isAuthenticated">
          <OtpInput
            :phoneNumber="phoneNumber"
            @onOtpSubmit="onSubmitOtp"
            @onEditPhoneNumber="showPhoneInput = true"
          />
        </div>

        <div xyz="fade left-80%" v-if="isAuthenticated && isNewSignup">
          <UserInfoInput :user="authStore.user" @onUpdate="onSignUp" />
        </div>
      </XyzTransition>
    </n-message-provider>
  </n-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NCard, NMessageProvider, useMessage } from "naive-ui";
import { XyzTransition } from "@animxyz/vue3";
import PhoneNumberInput from "@/components/Registration/PhoneNumberInput.vue";
import OtpInput from "@/components/Registration/OtpInput.vue";
import Loading from "../Loading.vue";
import { useAuthStore } from "../../stores/auth";
import UserInfoInput from "./UserInfoInput.vue";

import { useDialog } from "naive-ui";
import { useOtpStore } from "../../stores/otp";
import type UpdateUserDetails from "../../types/update_user_details/update_user_details";

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    const otpStore = useOtpStore();
    const dialog = useDialog();
    const message = useMessage();

    return { authStore, otpStore, dialog, message };
  },
  data() {
    return {
      phoneNumber: undefined as string | undefined,
    };
  },
  props: {
    isSignUp: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    title(): string {
      if (this.isSignUp) {
        return "Sign Up";
      }

      return "Log In";
    },
    showPhoneInput(): boolean {
      return !this.otpStore.otpSent;
    },
    isAuthenticated(): boolean {
      return this.authStore.isAuthenticated;
    },
    isNewSignup(): boolean {
      return this.authStore.isAuthenticated && !this.authStore.hasSignedUp;
    },
  },
  components: {
    NCard,
    NMessageProvider,
    XyzTransition,
    PhoneNumberInput,
    OtpInput,
    UserInfoInput,
    Loading,
  },
  emits: ["onCloseModal"],
  methods: {
    onSubmitPhoneNumber(phoneNumber: string) {
      this.phoneNumber = phoneNumber;
      this.otpStore.sendOtp("91", phoneNumber);
    },
    async onSubmitOtp(otp: string) {
      try {
        const user = await this.otpStore.verifyOtp(otp);

        this.authStore.uid = user.uid;
        this.authStore.phoneNumber = user.phoneNumber;
        await this.authStore.getUserData();

        if (this.isAuthenticated && this.authStore.hasSignedUp) {
          this.$router.replace("/home");
        }
      } catch (error) {
        this.message.error("Wrong OTP");
      }
    },
    async onSignUp(details: UpdateUserDetails) {
      await this.authStore
        .updateUserDetails(details)
        .then(() => {
          if (this.isAuthenticated && this.authStore.hasSignedUp) {
            this.$router.replace("/home");
          }
        })
        .catch((error) => {
          console.log(error);
          this.message.error(
            "Something Went wrong while registring, please try again after verifying your details."
          );
        });
    },
    handleCloseModal() {
      if (this.showPhoneInput && !this.isAuthenticated) {
        this.$emit("onCloseModal");
      } else {
        this.dialog.warning({
          title: "Confirm",
          content: "Are you sure you want to cancel the process?",
          positiveText: "Sure",
          negativeText: "Not Sure",
          onPositiveClick: () => {
            if (this.isAuthenticated) {
              this.authStore.logOut();
            }
            this.$emit("onCloseModal");
          },
          onNegativeClick: () => {},
        });
      }
    },
  },
});
</script>

<style scoped lang="scss">
.heading {
  margin-top: -35px !important;
  font-size: 1.3rem;
}

.n-card {
  border-radius: 12px;
}
</style>
