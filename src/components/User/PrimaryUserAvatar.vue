<template>
  <div class="flex container">
    <text class="prefix-text">
      Hey <text class="username-text"> {{ userName }} </text>
    </text>
    <n-avatar
      round
      size="large"
      :bordered="true"
      :src="userProfilePic"
      fallback-src="https://www.croptecshow.com/wp-content/uploads/2017/04/guest-avatar-250x250px.png"
      object-fit="contain"
      color="$green-blue"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "../../stores/auth";
import { NAvatar } from "naive-ui";

export default defineComponent({
  name: "PrimaryUserAvatar",
  setup() {
    const authStore = useAuthStore();

    return { authStore };
  },
  props: {
    showGreeting: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    NAvatar,
  },
  computed: {
    userProfilePic(): string | undefined {
      if (this.authStore.user?.profilePic)
        return this.authStore.user?.profilePic;
      return "https://www.croptecshow.com/wp-content/uploads/2017/04/guest-avatar-250x250px.png";
    },
    userName(): String {
      return this.authStore.user?.firstName || "";
    },
  },
});
</script>

<style scoped lang="scss">
@import "../../assets/scss/variables.scss";
.container {
  align-items: center;
  justify-content: center;
}

.prefix-text {
  font-size: 20px;
  padding: auto;
}

.username-text {
  color: $green-blue;
  font-size: 24px;
  padding-right: 20px;
  font-weight: 700;
}
</style>
