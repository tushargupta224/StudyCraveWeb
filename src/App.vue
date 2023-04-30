<script lang="ts">
import { RouterView } from "vue-router";
import { NDialogProvider } from "naive-ui";
import { NConfigProvider, type GlobalThemeOverrides } from "naive-ui";
import "nprogress/nprogress.css";
import Loading from "./components/Loading.vue";

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
  mounted() {
    window.addEventListener("beforeunload", this.showLoading);
  },
  beforeUnmount() {
    window.addEventListener("beforeunload", this.showLoading);
  },
  components: {
    NDialogProvider,
    NConfigProvider,
    Loading,
  },
  methods: {
    showLoading() {
      this.loading = true;
    },
  },
};
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <loading v-if="loading">
        <template v-slot:body>
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div> </template
      ></loading>
      
      <router-view></router-view>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #4a2271;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>
