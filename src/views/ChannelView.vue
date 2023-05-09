<template>
  <div>
    <!-- <h1 v-if="pageStatus == `LOADING`">
      Loading Channel Id {{ $route.params.channelId }}
    </h1> -->
    <Loading v-if="pageStatus == `LOADING`">
      <template v-slot:body>
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </template>
    </Loading>
    <Loading v-else-if="pageStatus == `ENTERING`">
      <!-- Entering Channel Id {{ $route.params.channelId }} -->
      <template v-slot:body>
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </template>
    </Loading>
    <Loading v-if="pageStatus == `JOINING`">
      <!-- Joining Channel Id {{ $route.params.channelId }} -->
      <template v-slot:body>
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </template>
    </Loading>
    <h1 v-if="pageStatus == `ERROR`">
      Error Channel Id {{ $route.params.channelId }} {{ error }}
    </h1>
    <Chat :channel="channel!" v-if="pageStatus == `LOADED`" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useChannelStore } from "../stores/channel";
import type Channel from "../types/channels/channel";
import { ChannelLoadingEnum } from "../types/commom";
import { useAuthStore } from "../stores/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import Chat from "../components/Chat/chat.vue";
import Loading from "@/components/Loading.vue";

export default defineComponent({
  name: "ChannelView",
  setup() {
    const channelStore = useChannelStore();
    const { user } = useAuthStore();

    return { channelStore, user };
  },
  components: {
    Chat,
    Loading,
  },
  mounted() {
    this.channelStore
      .loadChannelByChannelId(this.channelId)
      .then((channel) => {
        this.channel = channel;
        if (channel.ownerId === this.user!.id) {
          this.pageStatus = ChannelLoadingEnum.ENTERING;
          this.channelStore
            .updateOwnerStatus(this.channelId, true)
            .then(() => {
              // this.channel = { ...this.channel!, ownerStatus: true };
              this.pageStatus = ChannelLoadingEnum.LOADED;
            })
            .catch((error) => {
              this.error = error;
              this.pageStatus = ChannelLoadingEnum.ERROR;
            });
        } else if (channel.memberIds.includes(this.user!.id)) {
          this.pageStatus = ChannelLoadingEnum.ENTERING;
          this.channelStore
            .setUserMemberStatus(this.channelId, this.user!.id, true)
            .then(() => {
              this.pageStatus = ChannelLoadingEnum.LOADED;
            })
            .catch((error) => {
              this.error = error;
              this.pageStatus = ChannelLoadingEnum.ERROR;
            });
        } else {
          this.pageStatus = ChannelLoadingEnum.JOINING;
          this.channelStore
            .joinChannel(this.channelId, this.user!.id)
            .then(() => {
              this.pageStatus = ChannelLoadingEnum.LOADED;
            })
            .catch((error) => {
              this.error = error;
              this.pageStatus = ChannelLoadingEnum.ERROR;
            });
        }
      })
      .catch((error) => {
        this.error = error;
        this.pageStatus = ChannelLoadingEnum.ERROR;
      });

    const unsubscibe = onSnapshot(
      doc(db, "channels", this.channelId),
      async (doc) => {
        if (doc.exists()) {
          this.channel = {
            id: doc.id,
            ...doc.data(),
          } as Channel;
        }
      }
    );
  },
  data() {
    return {
      channelId: this.$route.params.channelId as string,
      channel: undefined as Channel | undefined,
      pageStatus: ChannelLoadingEnum.LOADING,
      error: null as any,
    };
  },
  unmounted() {
    if (this.pageStatus == ChannelLoadingEnum.LOADED) {
      if (this.channel?.ownerId === this.user!.id) {
        this.channelStore.updateOwnerStatus(this.channelId, false);
      } else {
        this.channelStore.setUserMemberStatus(
          this.channelId,
          this.user!.id,
          false
        );
      }
    }
  },
});
</script>
<style lang="scss">
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
