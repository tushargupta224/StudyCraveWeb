<template>
  <div>
    <h1 v-if="pageStatus == `LOADING`">
      Loading Channel Id {{ $route.params.channelId }}
    </h1>
    <h1 v-else-if="pageStatus == `ENTERING`">
      Entering Channel Id {{ $route.params.channelId }}
    </h1>
    <h1 v-if="pageStatus == `JOINING`">
      Joining Channel Id {{ $route.params.channelId }}
    </h1>
    <h1 v-if="pageStatus == `ERROR`">
      Error Channel Id {{ $route.params.channelId }} {{ error }}
    </h1>
    <h1 v-if="pageStatus == `LOADED`">
      Loaded Channel Id {{ $route.params.channelId }}
    </h1>
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

export default defineComponent({
  name: "ChannelView",
  setup() {
    const channelStore = useChannelStore();
    const { user } = useAuthStore();

    return { channelStore, user };
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
