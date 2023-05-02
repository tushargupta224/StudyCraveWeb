<template>
  <n-card class="n-card__content" style="z-index: 1 !important">
    <n-space vertical v-if="!channelsFetched">
      <n-skeleton height="120px" width="84%" :sharp="false" />
      <n-skeleton height="120px" width="84%" :sharp="false" />
    </n-space>
    <n-tabs :animated="true" type="segment" v-else>
      <n-tab-pane name="All live Channels" tab="All live channels">
        <div class="card-container">
          <ChannelCard
            v-for="channel in channels"
            :channel="channel"
          ></ChannelCard>
        </div>
      </n-tab-pane>
      <n-tab-pane name="Joined Channel" tab="Joined Channel">
        <div class="card-container">
          <ChannelCard
            v-for="channel in joinedChannels"
            :channel="channel"
          ></ChannelCard>
        </div>
      </n-tab-pane>
      <n-tab-pane name="Explore Channel" tab="Explore Channel">
        <div class="card-container">
          <ChannelCard
            v-for="channel in exploreChannels"
            :channel="channel"
          ></ChannelCard>
        </div>
      </n-tab-pane>
      <n-tab-pane name="My Channel" tab="My Channel">
        <div class="card-container">
          <ChannelCard
            v-for="channel in myChannels"
            :channel="channel"
          ></ChannelCard>
        </div>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script lang="ts">
import { NCard, NTabPane, NTabs, NSpace, NSkeleton, NCarousel } from "naive-ui";
import { defineComponent, onUnmounted } from "vue";
import { useChannelStore } from "../../stores/channel";
import ChannelCard from "./ChannelCard.vue";
import { useAuthStore } from "../../stores/auth";
import { mapActions, mapState } from "pinia";

export default defineComponent({
  name: "ChannelSection",
  setup() {
    const { user } = useAuthStore();

    return {
      user,
    };
  },
  mounted() {
    this.loadChannels(this.user!.id);

    // // Listen for changes in channels
    // const unsubscribe = this.channelStore.$subscribe((mutation) => {});

    // // Unsubscribe on unmount
    // onUnmounted(unsubscribe);
  },
  unmounted() {
    this.onBeforeUnmount();
  },
  computed: {
    ...mapState(useChannelStore, [
      "channels",
      "myChannels",
      "joinedChannels",
      "exploreChannels",
      "channelsFetched",
    ]),
  },
  methods: {
    ...mapActions(useChannelStore, ["loadChannels", "onBeforeUnmount"]),
  },
  components: {
    NCard,
    NTabPane,
    NTabs,
    ChannelCard,
    NSpace,
    NSkeleton,
    NCarousel,
  },
});
</script>

<style lang="scss" scoped>
.n-card__content {
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
