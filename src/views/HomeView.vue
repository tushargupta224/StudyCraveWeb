<template>
  <div style="padding: 2rem; background-color: #FEFEFE;">
    <NavBar />
    <div class="content">
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
        class="box"
      >
        <div class="heading-container">
          <p>
            Hey,<span>{{ username }}</span> nice to have you on board.
          </p>
          <h2>Enjoy your Study Session.</h2>
        </div>
        <div style="height: 30px">
          <button class="create-button" @click="showModal = true">
            Create channel
          </button>
        </div>
      </div>
    </div>
  </div>
  <div style="background-color: #FEFEFE; padding-inline: 20px; padding-bottom: 20px;">
    <SoloChannelBanner></SoloChannelBanner>
    <ChannelsSection></ChannelsSection>
  </div>
  <n-modal v-model:show="showModal">
    <create-channel-form />
  </n-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { NModal } from "naive-ui";
import CreateChannelForm from "@/components/Channels/CreateChannelForm.vue";
import { useAuthStore } from "../stores/auth";
import ChannelsSection from "../components/Channels/ChannelsSection.vue";
import SoloChannelBanner from "@/components/Channels/SoloChannelBanner.vue";
import NavBar from "@/components/NavBar.vue";

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
  components: {
    NModal,
    CreateChannelForm,
    ChannelsSection,
    SoloChannelBanner,
    NavBar,
  },
  data() {
    return {
      showModal: false,
    };
  },
  computed: {
    username(): String {
      return this.authStore.user?.firstName || "";
    },
  },
});
</script>

<style lang="scss" scoped>
span {
  font-weight: 600;
}
.box {
  border-radius: 25px;
  background: #fff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  margin-top: 12px;
}
.heading-container {
  margin-left: 25px;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-button {
  display: inline-flex;
  border: none;
  background-image: linear-gradient(147deg, #fe8a39 0%, #fd3838 74%);
  padding: 15px 35px;
  border-radius: 50px;
  color: #fff;
  box-shadow: 0px 14px 80px rgba(252, 56, 56, 0.4);
  text-decoration: none;
  font-weight: 500;
  justify-content: center;
  text-align: center;
  letter-spacing: 1px;
  cursor: pointer;
  @media screen and (max-width: 576px) {
    width: 100%;
  }
}

@media all and (min-width: 768px) {
  .create-button {
    margin-right: 50px;
  }
}

@media all and (max-width: 460px) {
  .heading-container p {
    font-size: 0.6rem;
  }
  .heading-container h2 {
    font-size: 1rem;
    margin-top: -10px;
  }
  .box {
    display: flex;
    flex-direction: column;
  }
}
</style>
