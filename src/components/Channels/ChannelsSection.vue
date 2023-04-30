<template>
  <n-card class="n-card__content" style="z-index: 1 !important">
    <n-space vertical v-if="!channelStore.channelsFetched">
      <n-skeleton height="120px" width="84%" :sharp="false" />
      <n-skeleton height="120px" width="84%" :sharp="false" />
    </n-space>
    <n-tabs type="line" v-else>
      <n-tab-pane name="All live Channels" tab="All live channels">
        <div class="card-container">
          <ChannelCard
            v-for="channel in channelStore.channels"
            :channel="channel"
          ></ChannelCard>
        </div>
      </n-tab-pane>
      <n-tab-pane name="Joined Channel" tab="Joined Channel">
        <div class="card-container">
          <ChannelCard
            v-for="channel in channelStore.joinedChannels"
            :channel="channel"
          ></ChannelCard>
        </div>
      </n-tab-pane>
      <n-tab-pane name="Explore Channel" tab="Explore Channel">
        <div class="card-container">
          <ChannelCard
            v-for="channel in channelStore.exploreChannels"
            :channel="channel"
          ></ChannelCard>
        </div>
      </n-tab-pane>
      <n-tab-pane name="My Channel" tab="My Channel">
        <div class="card-container">
          <ChannelCard
            v-for="channel in channelStore.myChannels"
            :channel="channel"
          ></ChannelCard>
        </div>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script lang="ts">
import { NCard, NTabPane, NTabs, NSpace, NSkeleton } from "naive-ui";
import { defineComponent, onUnmounted } from "vue";
import { useChannelStore } from "../../stores/channel";
import ChannelCard from "./ChannelCard.vue";
import { useAuthStore } from "../../stores/auth";

export default defineComponent({
  name: "ChannelSection",
  setup() {
    const channelStore = useChannelStore();
    const { user } = useAuthStore();

    // Load channels on mount
    channelStore.loadChannels(user!.id);

    // Listen for changes in channels
    const unsubscribe = channelStore.$subscribe((mutation) => {});

    // Unsubscribe on unmount
    onUnmounted(unsubscribe);

    return {
      channelStore,
    };
  },
  components: { NCard, NTabPane, NTabs, ChannelCard, NSpace, NSkeleton },
});
</script>

<style lang="scss" scoped>
.n-card__content {
  background: #f5f2ea;
  z-index: 0 !important;
}
.card-container {
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
  flex-wrap: wrap;
  z-index: 1 !important;
}
</style>
