import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

import App from "./App.vue";
import VueAnimXyz from "@animxyz/vue3";
import router from "./router";
import "@animxyz/core";

import "./assets/scss/main.scss";

// import function to register Swiper custom elements
import { register } from "swiper/element/bundle";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia);
app.use(router);
app.use(VueAnimXyz);

// register Swiper custom elements
register();

app.mount("#app");
