<template>
  <div class="msg" :class="{ 'left-msg': !isAuthor, 'right-msg': isAuthor }">
    <div class="msg-img" :style="`background-image: url(${userAvatar});`"></div>

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
      if (
        this.message.senderAvatar?.length === 0 ||
        !this.message.senderAvatar
      ) {
        return "/images/placeholder_avatar.png";
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

  &.left-msg {
    align-items: flex-start;
  }
}
.msg:last-of-type {
  margin: 0;
}
.msg-img {
  width: 42px;
  height: 42px;
  margin-right: 10px;
  background: #ddd;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
}
.msg-bubble {
  max-width: 450px;
  padding: 15px;
  border-radius: 15px;
  background: $left-msg-bg;
  background: linear-gradient(90deg, #fed2d6 0%, #fcafec 100%);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.08);
}
.msg-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.msg-info-name {
  margin-right: 20px;
  font-weight: bold;
}
.msg-info-time {
  font-size: 8px;
}

.left-msg .msg-bubble {
  border-bottom-left-radius: 0;
}

.right-msg {
  flex-direction: row-reverse;
}
.right-msg .msg-bubble {
  border-bottom-right-radius: 0;
  margin-bottom: 2.5%;
  background: linear-gradient(90deg, #D7FEF6 0%, #D5FCCE 100%);
}
.right-msg .msg-img {
  margin-bottom: 2.5%;
  margin-left: 1%;
}
</style>
