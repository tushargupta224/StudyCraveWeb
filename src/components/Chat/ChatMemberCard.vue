<template>
  <div class="member_card">
    <div>
      <div class="avatar">
        <img :src="userAvatar" alt="" />
      </div>
    </div>
    <div class="name">
      {{ name }}
      <div class="status" v-if="isOnline" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatMemberCard",
  props: {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String || null,
    },
    isOnline: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    userAvatar(): string {
      if (this.avatar?.length === 0 || !this.avatar) {
        return "/images/placeholder_avatar.png";
      }
      return this.avatar;
    },
  },
});
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:opsz@9..40display=swap");

.member_card {
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 100px;
  backdrop-filter: blur(40px);
  padding: 8px;
  align-items: center;
}

.avatar {
  width: 42px;
  height: 42px;
  background: linear-gradient(90deg, #f0feea 0%, #fcd9ce 100%);
  box-shadow: 0px 4px 20px rgba(255, 255, 255, 0.08);
  border-radius: 100%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
}

.name {
  margin-left: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-weight: 600;
  font-family: "DM Sans";
  color: white;
  font-size: 14px;
}

.status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #78FF9E;
  margin-right: 12px;
}
</style>
