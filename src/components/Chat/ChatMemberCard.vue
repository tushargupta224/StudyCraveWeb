<template>
  <div class="member_card">
    <div>
      <div class="avatar">
        <img :src="userAvatar" alt=""/>
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
        if(this.avatar?.length === 0 || !this.avatar) {
            return "https://avatars.mds.yandex.net/i?id=14e79b2024212714c242526ba0f9f731c295a775-4712318-images-thumbs&n=13";
        }
        return this.avatar;
    }
  }
});
</script>
<style lang="scss" scoped>
.member_card {
  display: flex;
  padding: 0.5rem 1rem;
  margin: 12px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  cursor: pointer;
  align-items: center;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  overflow: hidden;
}

.avatar img{
    width: 100%;
    height: 100%;
}

.name {
  margin-left: 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-weight: 600;
}

.status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: green;
}
</style>
