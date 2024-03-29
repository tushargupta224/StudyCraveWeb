<template>
  <n-card class="n-card__content" style="z-index: 1 !important">
    <n-space vertical v-if="!channelsFetched">
      <n-skeleton height="120px" width="84%" :sharp="false" />
      <n-skeleton height="120px" width="84%" :sharp="false" />
    </n-space>
    <n-tabs :animated="true" class="tabs-custom" type="segment" v-else>
      <n-tab-pane name="All live Channels" tab="All live channels">
        <div class="card-container">
          <ChannelCard
            v-for="channel in channels"
            :channel="channel"
          ></ChannelCard>
          <div v-if="channels.length === 0">
            <div class="img-container">
              <img :src="img" alt="" />
              <h2>Nothing to Show</h2>
            </div>
          </div>
        </div>
      </n-tab-pane>
      <n-tab-pane name="Joined Channel" tab="Joined Channel">
        <div class="card-container">
          <ChannelCard
            v-for="channel in joinedChannels"
            :channel="channel"
          ></ChannelCard>
          <div v-if="joinedChannels.length === 0">
            <div class="img-container">
              <img :src="img" alt="" />
              <h2>Nothing to Show</h2>
            </div>
          </div>
        </div>
      </n-tab-pane>
      <n-tab-pane name="Explore Channel" tab="Explore Channel">
        <div class="card-container">
          <ChannelCard
            v-for="channel in exploreChannels"
            :channel="channel"
          ></ChannelCard>
          <div v-if="exploreChannels.length === 0">
            <div class="img-container">
              <img :src="img" alt="" />
              <h2>Nothing to Show</h2>
            </div>
          </div>
        </div>
      </n-tab-pane>
      <n-tab-pane name="My Channel" tab="My Channel">
        <div class="card-container">
          <ChannelCard
            v-for="channel in myChannels"
            :channel="channel"
          ></ChannelCard>
          <div v-if="myChannels.length === 0">
            <div class="img-container">
              <img :src="img" alt="" />
              <h2>Nothing to Show</h2>
            </div>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script lang="ts">
import { NCard, NTabPane, NTabs, NSpace, NSkeleton, NCarousel } from "naive-ui";
import { defineComponent } from "vue";
import { useChannelStore } from "../../stores/channel";
import ChannelCard from "./ChannelCard.vue";
import { useAuthStore } from "../../stores/auth";
import { mapActions, mapState } from "pinia";

export default defineComponent({
  name: "ChannelSection",
  setup() {
    const { user } = useAuthStore();
    const img =
      "https://img.freepik.com/free-vector/curiosity-search-concept-illustration_114360-11031.jpg?w=826&t=st=1683633559~exp=1683634159~hmac=40dab1d8ef825029ed673a38fe9dcfbfd1ecffe9c7f56f61402e0967c4c25994";

    return {
      user,
      img,
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
  background: #fff7e8;
  border-radius: 32px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  min-height: 600px;
}
.card-container {
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
  flex-wrap: wrap;
  z-index: 1 !important;
  margin-top: 12px;
}
.img-container {
  width: 100%;
  min-height: 550px;
  // height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column-reverse;
}
.img-container img {
  width: 35%;
  height: 35%;
}
.img-container h2 {
  font-size: 2.5rem;
}

.tabs-custom::v-deep .n-tabs-rail {
  border-radius: 100px !important;
  background: white;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px;
}

.tabs-custom::v-deep .n-tabs-tab {
  border-radius: 100px !important;
  color: black !important;
}

.tabs-custom::v-deep .n-tabs-tab.n-tabs-tab--active {
  background-image: linear-gradient(147deg, #fe8a39 0%, #fd3838 74%);
  color: #fff !important;
  box-shadow: 0px 14px 80px rgba(252, 56, 56, 0.4);
}
</style>
