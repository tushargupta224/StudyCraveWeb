import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import VueAnimXyz from "@animxyz/vue3";
import router from "./router";
import "@animxyz/core";

import "./assets/scss/main.scss";
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueAnimXyz);

app.mount("#app");
