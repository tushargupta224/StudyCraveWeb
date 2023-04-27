<script lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import { NDialogProvider } from "naive-ui";
import { NConfigProvider, type GlobalThemeOverrides } from "naive-ui";
import 'nprogress/nprogress.css';
import Loading from './components/Loading.vue'

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
      loading: false,
    };
  },
  mounted(){
    window.addEventListener('beforeunload', this.showLoading)
  },
  beforeUnmount() {
      window.addEventListener('beforeunload', this.showLoading)
  },
  components: {
    NavBar,
    NDialogProvider,
    NConfigProvider,
    Loading,
  },
  methods:{
    showLoading(){
      this.loading = true
    }
  }
};
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <loading v-if="loading"></loading>
      <NavBar />
      

      <!-- <RouterView /> -->
      <router-view></router-view>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped>



</style>
