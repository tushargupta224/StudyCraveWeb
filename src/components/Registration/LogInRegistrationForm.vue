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
        <div xyz="fade right-80%" v-if="showPhoneInput && !isAuthenticated">
          <PhoneNumberInput
            @onSubmit="onSubmitPhoneNumber"
            :phoneNumber="phoneNumber"
            :title="isSignUp ? 'Create your account.' : 'Welcome back'"
          />
        </div>

        <div xyz="fade left-80%" v-if="!showPhoneInput && !isAuthenticated">
          <OtpInput
            :phoneNumber="phoneNumber"
            @onOtpSubmit="onSubmitOtp"
            @onEditPhoneNumber="showPhoneInput = true"
          />
        </div>

        <div xyz="fade left-80%" v-if="!showPhoneInput && isSignup">
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

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    const dialog = useDialog();

    return { authStore, dialog };
  },
  data() {
    return {
      phoneNumber: undefined as string | undefined,
      showPhoneInput: true,
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
    isAuthenticated(): boolean {
      return this.authStore.isAuthenticated;
    },
    isSignup(): boolean {
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
  watch: {
    checkIfUserSignedUpOrLogin(isAuthenticated, isSignup) {
      if (isAuthenticated && isSignup) {
        this.$router.replace("/home");
      }
    },
  },
  emits: ["onCloseModal"],
  methods: {
    onSubmitPhoneNumber(phoneNumber: string) {
      this.phoneNumber = phoneNumber;
      this.showPhoneInput = false;
    },
    onSubmitOtp(otp: string) {
      this.authStore.user = {
        id: "asdadas",
        firstName: "Kunal",
        lastName: "",
        email: "kunalKishore2gmail.com",
        phoneCountryCode: "91",
        phoneNumber: this.phoneNumber!,
      };
    },
    onSignUp(details: SignUpDetails) {
      const user = this.authStore.user;
      this.authStore.user = {
        id: "asdadas",
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        phoneCountryCode: user?.phoneCountryCode || "",
        phoneNumber: user?.phoneNumber || "",
      };
    },
    handleCloseModal() {
      if (this.showPhoneInput) {
        this.$emit("onCloseModal");
      } else {
        this.dialog.warning({
          title: "Confirm",
          content: "Are you sure?",
          positiveText: "Sure",
          negativeText: "Not Sure",
          onPositiveClick: () => {
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

@media screen and (max-width: 1440px){

  .modal{
    width: 600px;
  }

}

@media screen and (max-width: 598px){
  .modal{
    width: 500px !important;
  }
}
@media screen and (max-width: 500px){
  .modal{
    width: 350px !important;
  }
}
@media screen and (max-width: 350px){
  .modal{
    width: 300px !important;
  }
}

.n-card {
  border-radius: 12px;
}
</style>

