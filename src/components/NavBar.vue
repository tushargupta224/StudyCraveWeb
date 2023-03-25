<template>
  <header class="flex max-width landing-page-header">
    <img :src="logo" alt="logo" class="logo" />
    <div class="flex">
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
        <n-card
          style="width: 600px"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
        >
          <n-message-provider>
            <PhoneNumberInput />
            <OtpInput/>
          </n-message-provider>
        </n-card>
      </n-modal>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import logo from "@/assets/images/logo.png";
import AnimatedButton from "./AnimatedButton.vue";
import { NModal, NCard, NButton, NMessageProvider } from "naive-ui";
import PhoneNumberInput from "./Registration/PhoneNumberInput.vue";
import OtpInput from "./Registration/OtpInput.vue";

export default defineComponent({
  name: "NavBar",
  data() {
    return {
      logo: logo,
      showModal: false,
    };
  },
  components: {
    AnimatedButton,
    NModal,
    NCard,
    NButton,
    PhoneNumberInput,
    NMessageProvider,
    OtpInput,
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
