<template>
  <header class="flex max-width landing-page-header">
    <img :src="logo" alt="logo" class="logo" />
    <div class="flex absolute-center" v-if="!isLoggedIn">
      <n-button
        text
        text-color="#0f0f0f"
        size="large"
        @click="
          showSignUp = false;
          showModal = true;
        "
        style="font-size: 1rem"
        class="navbar-btn"
        >Log in</n-button
      >
      <n-button
        ghost
        color="#bab8ba"
        text-color="#0f0f0f"
        size="large"
        @click="
          showSignUp = true;
          showModal = true;
        "
        style="margin-left: 2rem; font-size: 1rem"
        class="navbar-btn"
        >Sign up</n-button
      >

      <n-modal v-model:show="showModal">
        <LogInRegistrationForm
          :isSignUp="showSignUp"
          @onCloseModal="showModal = false"
        ></LogInRegistrationForm>
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
      showSignUp: false,
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
      return this.authStore.isAuthenticated && this.authStore.hasSignedUp;
    },
  },
  watch: {
    authStore(isAuthenticated, hasSignedUp) {
      if (isAuthenticated && !hasSignedUp) {
        if (!this.showModal) {
          this.showModal = true;
        }
      } else if (this.isLoggedIn) {
        this.showModal = false;
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

// @media screen and (max-width : 2560px){
//   .logo{
//     height: 120px;
//   }
//   .navbar-btn{
//     width: 200px !important;
//     height: 100px !important;
//     font-size: 30px !important;
//   }
// }
@media screen and (max-width : 1440px){
  .logo{
    height: 50px;
  }
  .navbar-btn{
    width: initial !important;
    height: 40px !important;
    font-size: 15px !important;
  }

}
@media screen and (max-width : 468px){
  .logo{
    height: 30px;
  }
  .navbar-btn{
    width: 60px !important;
    height: 30px !important;
    font-size: 12px !important;
    padding-left: 10px !important;
    margin-left: 0.2rem !important;
  }
}
@media screen and (max-width : 325px){
  .logo{
    height: 28px;
  }
  .navbar-btn{
    // width: 60px !important;
    height: 30px !important;
    font-size: 10px !important;
    margin-left: 0.05rem !important;
    padding-left: 12px !important;
  }
}

</style>
