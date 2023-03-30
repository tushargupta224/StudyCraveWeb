<script lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import { NDialogProvider } from "naive-ui";

export default {
  components: {
    NavBar,
    NDialogProvider,
  },
};
</script>

<template>
  <n-dialog-provider>
    <NavBar />

    <RouterView />
  </n-dialog-provider>
</template>

<style scoped></style>
