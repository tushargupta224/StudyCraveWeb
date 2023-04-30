<template>
  <!-- <h1>Home View</h1> -->
  <div class="content">
    <div>
      <p>
        Hey,<span>{{ username }}</span> nice to have you on board.
      </p>
      <h2>Enjoy your Study Session.</h2>
    </div>
    <div>
      <button class="create-button" @click="showModal = true">
        Create channel
      </button>
    </div>
  </div>
  <div>
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
body {
  background: white;
}

span {
  font-weight: 600;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background-color 0.2s ease-in-out;
  margin-right: 80px;
}
</style>
