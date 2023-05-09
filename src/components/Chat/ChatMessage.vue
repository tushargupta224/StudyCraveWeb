<template>
  <div class="msg" :class="{ 'left-msg': !isAuthor, 'right-msg': isAuthor }">
    <div
      class="msg-img"
      :style="
      `background-image: url(${userAvatar});`
      "
    ></div>

    <div class="msg-bubble">
      <div class="msg-info">
        <div class="msg-info-name">{{ message.senderName }}</div>
        <div class="msg-info-time">{{ updateTime }}</div>
      </div>

      <div class="msg-text">
        {{ message.message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from "@/stores/auth";
import type Message from "@/types/channels/message";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "ChatMessage",
  props: {
    message: {
      required: true,
      type: Object as PropType<Message>,
    },
  },
  setup() {
    const { user } = useAuthStore();

    return { user };
  },
  computed: {
    isAuthor(): boolean {
      return this.message.senderId == this.user?.id;
    },
    userAvatar(): string {
        if(this.message.senderAvatar?.length === 0 || !this.message.senderAvatar) {
            return "https://avatars.mds.yandex.net/i?id=14e79b2024212714c242526ba0f9f731c295a775-4712318-images-thumbs&n=13";
        }
        return this.message.senderAvatar;
    },
    updateTime(): string {
      const date = new Date(this.message.createdAt);
      return `${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";
.msg {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
}
.msg:last-of-type {
  margin: 0;
}
.msg-img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  background: #ddd;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
  margin-bottom: 4%;
}
.msg-bubble {
  max-width: 450px;
  padding: 15px;
  border-radius: 15px;
  background: $left-msg-bg;
  margin-bottom: 1.5%;
  background: #f64f59; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #a8ff78,
    #78ffd6
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #a8ff78,
    #78ffd6
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.msg-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.msg-info-name {
  margin-right: 10px;
  font-weight: bold;
}
.msg-info-time {
  font-size: 0.65em;
}

.left-msg .msg-bubble {
  border-bottom-left-radius: 0;
}

.right-msg {
  flex-direction: row-reverse;
}
.right-msg .msg-bubble {
  color: #fff;
  border-bottom-right-radius: 0;
  margin-bottom: 2.5%;
  background: #1a2980; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #1a2980,
    #26d0ce
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #1a2980,
    #26d0ce
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.right-msg .msg-img {
  margin-bottom: 2.5%;
  margin-left: 1%;
}
</style>
