<script lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import { NDialogProvider } from "naive-ui";
import { NConfigProvider, type GlobalThemeOverrides } from "naive-ui";

const themeOverrides: GlobalThemeOverrides = {
  Button: {
    textColorGhostHover: "#001f3f",
    rippleColor: "#001f3f",
    borderHover: "1px solid #001f3f",
  },
  Input: {
    borderFocus: "1px solid #001f3f",
    borderHover: "1px solid #001f3f",
  },
};

export default {
  data() {
    return {
      themeOverrides: themeOverrides,
    };
  },
  components: {
    NavBar,
    NDialogProvider,
    NConfigProvider,
  },
};
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <NavBar />

      <RouterView />
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped></style>
