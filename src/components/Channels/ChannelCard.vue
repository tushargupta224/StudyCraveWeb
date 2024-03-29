<template>
  <div class="card">
    <div class="header-row">
      <div style="display: flex; flex-direction: row; align-items: center">
        <div class="channel-name">
          <p style="font-size: 32px; font-family: 'DM Sans'">#</p>
          <p style="margin-left: 4px">{{ channel.name }}</p>
        </div>
        <div class="live-tag">
          <div class="live-dot"></div>
          <p>Live</p>
        </div>
      </div>
    </div>
    <div class="content-part">
      <div style="font-family: 'Crimson Text'">
        <p style="font-size: 10px; color: #575757">Topic name</p>
        <p style="font-size: 20px">{{ channel.topic }}</p>
      </div>
    </div>
    <div class="footer-row">
      <n-avatar-group :options="avatarOptions" :size="40" :max="5">
        <template #avatar="{ option: { name, src } }">
          <n-avatar color="#FFB178" :src="src" v-if="src"> </n-avatar>
          <n-avatar color="#FFB178" :src="src" v-else>
            <template v-slot="placeholder">{{
              name[0].toUpperCase()
            }}</template>
          </n-avatar>
        </template>
        <template #rest="{ options: restOptions, rest }">
          <n-avatar color="#BDFFEF"
            ><p style="color: #050505">+{{ rest }}</p></n-avatar
          >
        </template>
      </n-avatar-group>
      <div class="btn" @click="onJoinOrEnter">
        <p class="btn-title">
          {{ buttonTitle }}
        </p>
        <n-icon>
          <ChevronRight28Filled />
        </n-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { useAuthStore } from "../../stores/auth";
import type Channel from "../../types/channels/channel";
import { NAvatarGroup, NAvatar } from "naive-ui";
import { ChevronRight28Filled } from "@vicons/fluent";
import { NIcon } from "naive-ui";

export default defineComponent({
  name: "ChannelCard",
  setup() {
    const authStore = useAuthStore();

    return {
      userId: authStore.uid,
    };
  },
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },
  components: { NAvatarGroup, NAvatar, ChevronRight28Filled, NIcon },
  computed: {
    isJoined(): boolean {
      return this.channel.memberIds.includes(this.userId!);
    },
    buttonTitle(): string {
      if (
        this.channel.memberIds.includes(this.userId!) ||
        this.channel.ownerId === this.userId
      ) {
        return "Enter";
      } else {
        return "Join Now";
      }
    },
    avatarOptions() {
      return this.channel.members.map((m) => {
        return {
          name: m.name,
          src: m.avatar,
        };
      });
    },
  },
  methods: {
    onJoinOrEnter() {
      this.$router.push(`/channel/${this.channel.id}`);
    },
  },
});
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Crimson+Text&family=DM+Sans:opsz@9..40&family=Mandali&display=swap");

p {
  margin: 0px;
}

.card {
  height: 190px;
  width: 380px;
  background: #fff9f2;
  border-radius: 18px;
  overflow: hidden;
  padding: 20px;
  background-image: url("/images/bubbles.png");
  box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px,
    rgba(17, 17, 26, 0.1) 0px 0px 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.channel-name {
  font-size: 24px;
  font-family: "Mandali";
  display: flex;
  flex-direction: row;
  align-items: center;
}

.content-part {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.footer-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.live-tag {
  background: white;
  margin-left: 12px;
  padding-inline: 12px;
  padding-block: 4px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px,
    rgba(17, 17, 26, 0.1) 0px 0px 8px;

  p {
    font-family: "DM Sans";
    font-weight: 600;
    font-size: 12px;
  }
}

.live-dot {
  height: 8px;
  width: 8px;
  margin-right: 4px;
  background: red;
  border-radius: 100px;
}

.btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}

.btn-title {
  font-family: "DM Sans";
  font-size: 18px;
  border-bottom: 2px solid #000;
  padding-bottom: 5px;
  white-space: nowrap;
}
</style>
