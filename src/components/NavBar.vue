<template>
  <header class="flex max-width landing-page-header">
    <img :src="logo" alt="logo" class="logo" />
    <div class="flex">
      <AnimatedButton label="Log in"></AnimatedButton>
      <AnimatedButton label="Sign up" custom-class="outlined"></AnimatedButton>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import logo from "@/assets/images/logo.png";
import AnimatedButton from "./AnimatedButton.vue";

export default defineComponent({
  name: "NavBar",
  data() {
    return {
      logo: logo,
    };
  },
  components: { AnimatedButton },
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
