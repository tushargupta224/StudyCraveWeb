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
    <n-card class="n-card__conten" style="z-index: 1 !important;">
      <n-tabs type="line">
        <n-tab-pane name="All live Channels" tab="All live channels">
          <div class="card-container">
            <div class="card" v-for="card in cards" :key="card.id">
              <h2 class="card-title">{{ card.title }}</h2>
              <h3 class="card-subtitle">{{ card.subtitle }}</h3>
              <p class="card-created-by">created by {{ card.owner }}</p>
              <button class="join-button">Join Now</button>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="My favourite Channel" tab="My favourite channel">
          Hello favourite Channnel
        </n-tab-pane>
        <n-tab-pane name="Your Channel" tab="Your channel">
          Hello My Channnel
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
  <n-modal v-model:show="showModal">
    <create-channel-form />
  </n-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { NCard, NTabs, NTabPane, NModal } from "naive-ui";
import CreateChannelForm from "@/components/Channels/CreateChannelForm.vue";
import { useAuthStore } from "../stores/auth";

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    return {
      authStore,
    };
  },
  components: {
    NCard,
    NTabPane,
    NTabs,
    NModal,
    CreateChannelForm,
    
  },

  data() {
    return {
      cards: [
        { id: 1, title: "card 1", subtitle: "subtitle 1", owner: "Jane" },
        { id: 2, title: "card 2", subtitle: "subtitle 2", owner: "Jale" },
        { id: 3, title: "card 3", subtitle: "subtitle 3", owner: "June" },
        { id: 4, title: "card 4", subtitle: "subtitle 4", owner: "Jan" },
        { id: 5, title: "card 5", subtitle: "subtitle 5", owner: "Jun" },
        { id: 6, title: "card 6", subtitle: "subtitle 6", owner: "Aun" },
      ],
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
.n-card__conten {
  background: #f5f2ea;
  z-index: 0 !important;
}
span {
  font-weight: 600;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

//  .n-tabs-tab{
//   background-color: #ccc;
// }

.card-container {
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
  flex-wrap: wrap;
  z-index: 1 !important;
}

.card {
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  background-color: #fff;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: scale(1.05);
}

.card-title {
  font-size: 28px;
  margin: 20px 0 10px 0;
  font-weight: 600;
  color: #333;
}

.card-subtitle {
  font-size: 18px;
  margin: 10px 0 20px 0;
  color: #555;
}

.card-created-by {
  font-size: 14px;
  margin: 0 0 10px 0;
  color: #888;
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

.join-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 30px;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  transition: background-color 0.2s ease-in-out;
}

.join-button:hover {
  background-color: #0062cc;
}
</style>
