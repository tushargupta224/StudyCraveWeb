<template>
  <header class="flex max-width landing-page-header">
    <img :src="logo" alt="logo" class="logo" />
    <div class="flex" v-if="!isLoggedIn">
      <n-button
        text
        text-color="#0f0f0f"
        size="large"
        @click="showModal = true"
        style="font-size: 1rem"
        >Log in</n-button
      >
      <n-button
        ghost
        color="#bab8ba"
        text-color="#0f0f0f"
        size="large"
        style="margin-left: 2rem; font-size: 1rem"
        >Sign up</n-button
      >

      <n-modal v-model:show="showModal">
        <LogInRegistrationForm></LogInRegistrationForm>
      </n-modal>
    </div>

    <div v-if="isLoggedIn">
      <PrimaryUserAvatar></PrimaryUserAvatar>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import logo from "@/assets/images/logo.png";
import AnimatedButton from "./AnimatedButton.vue";
import { NModal, NButton } from "naive-ui";
import LogInRegistrationForm from "./Registration/LogInRegistrationForm.vue";
import { useAuthStore } from "../stores/auth";
import PrimaryUserAvatar from "@/components/User/PrimaryUserAvatar.vue";

export default defineComponent({
  name: "NavBar",
  setup() {
    const authStore = useAuthStore();

    return { authStore };
  },
  data() {
    return {
      logo: logo,
      showModal: false,
      showPhoneInput: true,
    };
  },
  components: {
    AnimatedButton,
    NModal,
    NButton,
    PrimaryUserAvatar,
    LogInRegistrationForm,
  },
  computed: {
    isLoggedIn(): boolean {
      return this.authStore.isAuthenticated;
    },
  },
  methods: {
    onSubmitOtp() {
      if (this.isLoggedIn) {
        this.$router.replace("/home");
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

.landing-page-header {
  justify-content: space-between;
  align-items: center;
}
.logo {
  height: 50px;
}
</style>
