<template>
  <div class="flex container">
    <text class="prefix-text">
      Hey <text class="username-text"> {{ userName }} </text>
    </text>
    <n-dropdown :show="showProfileDropdown" :options="options" size="huge">
      <n-avatar
        round
        size="large"
        :bordered="true"
        :src="userProfilePic"
        @click="handleUserAvatarClick"
        fallback-src="https://www.croptecshow.com/wp-content/uploads/2017/04/guest-avatar-250x250px.png"
        object-fit="contain"
        color="$green-blue"
        class="avatar"
      />
    </n-dropdown>
  </div>
</template>

<script lang="ts">
import { h, defineComponent } from "vue";
import type { Component } from "vue";
import { useAuthStore } from "../../stores/auth";
import { NAvatar, NDropdown, NAvatarGroup, NIcon } from "naive-ui";
import { auth } from "@/config/firebase";
import { useRouter } from "vue-router";
import {
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
} from "@vicons/ionicons5";

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

export default defineComponent({
  name: "PrimaryUserAvatar",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    return {
      authStore,
      options: [
        {
          label: "Profile",
          key: "Profile",
          icon: renderIcon(UserIcon),
        },
        {
          label: "Edit Profile",
          key: "Edit Profile",
          icon: renderIcon(EditIcon),
        },
        {
          label: "Log Out",
          key: "Log Out",
          icon: renderIcon(LogoutIcon),

          props: {
           
            onClick: () => {
              auth
                .signOut()
                .then(() => router.replace("/"))
                .catch((error) => {});
            },
          },
        },
      ],
    };
  },
  data() {
    return {
      showProfileDropdown: false,
    };
  },
  props: {
    showGreeting: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    NAvatar,
    NDropdown,
    NAvatarGroup,
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
  methods: {
    handleUserAvatarClick() {
      this.showProfileDropdown = !this.showProfileDropdown;
    },
  },
});
</script>

<style lang="scss">
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
.avatar {
  cursor: pointer;
}
</style>
