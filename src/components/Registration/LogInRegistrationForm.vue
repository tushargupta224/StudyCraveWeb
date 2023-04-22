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
          <UserInfoInput :user="authStore.user" @onSignUp="onSignUp" />
        </div>
      </XyzTransition>
    </n-message-provider>
  </n-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NCard, NMessageProvider } from "naive-ui";
import { XyzTransition } from "@animxyz/vue3";
import PhoneNumberInput from "@/components/Registration/PhoneNumberInput.vue";
import OtpInput from "@/components/Registration/OtpInput.vue";
import { useAuthStore } from "../../stores/auth";
import UserInfoInput from "./UserInfoInput.vue";
import type SignUpDetails from "../../types/signup/signup_details";
import { useDialog } from "naive-ui";
import { useOtpStore } from "../../stores/otp";

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    const otpStore = useOtpStore();
    const dialog = useDialog();

    return { authStore, otpStore, dialog };
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
  },
  emits: ["onCloseModal"],
  methods: {
    onSubmitPhoneNumber(phoneNumber: string) {
      this.phoneNumber = phoneNumber;
      this.otpStore.sendOtp("91", phoneNumber);
    },
    onSubmitOtp(otp: string) {
      this.otpStore.verifyOtp(otp).then((user) => {
        this.authStore.uid = user.uid;
        this.authStore.phoneNumber = user.phoneNumber;
        this.authStore
          .getUserData()
          .then(() => {
            if (this.isAuthenticated && this.authStore.hasSignedUp) {
              this.$router.replace("/home");
            }
          })
          .catch((error) => {});
      });
    },
    async onSignUp(details: SignUpDetails) {
      const user = this.authStore.user;
      if (user) {
        const updatedUser = {
          ...user,
          firstName: details.firstName,
          lastName: details.lastName,
          email: details.email,
        };

        await this.authStore
          .updateUserDetails(updatedUser)
          .then(() => {
            if (this.isAuthenticated && this.authStore.hasSignedUp) {
              this.$router.replace("/home");
            }
          })
          .catch((error) => {});
      }
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

@media screen and (max-width: 1440px) {
  .modal {
    width: 600px;
  }
}

@media screen and (max-width: 598px) {
  .modal {
    width: 500px !important;
  }
}
@media screen and (max-width: 500px) {
  .modal {
    width: 350px !important;
  }
}
@media screen and (max-width: 350px) {
  .modal {
    width: 300px !important;
  }
}

.n-card {
  border-radius: 12px;
}
</style>
