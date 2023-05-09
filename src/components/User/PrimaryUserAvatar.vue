<template>
  <div class="flex container">
    <text class="prefix-text non-mobile">
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
    <Profile :show="viewProfile" @onClose="viewProfile = false" />
    <n-modal :show="editProfile">
      <n-card title="Update Profile" style="width: 500px; border-radius: 18px">
        <div class="cross-con" @click="close">
          <div class="cross">&#10006;</div>
        </div>
        <UserInfoInput />
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts">
import { h, defineComponent, ref } from "vue";
import type { Component } from "vue";
import { useAuthStore } from "../../stores/auth";
import {
  NAvatar,
  NDropdown,
  NAvatarGroup,
  NIcon,
  NModal,
  NCard,
} from "naive-ui";
import { auth } from "@/config/firebase";
import { useRouter } from "vue-router";
import {
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
} from "@vicons/ionicons5";
import Profile from "@/components/User/Profile.vue";
import UserInfoInput from "../Registration/UserInfoInput.vue";

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
    const viewProfile = ref(false);
    const editProfile = ref(false);

    function close() {
      editProfile.value = false;
      console.log("click");
    }

    return {
      authStore,
      viewProfile,
      editProfile,
      close,
      options: [
        {
          label: "Profile",
          key: "Profile",
          icon: renderIcon(UserIcon),

          props: {
            onClick: () => {
              viewProfile.value = !viewProfile.value;
            },
          },
        },
        {
          label: "Edit Profile",
          key: "Edit Profile",
          icon: renderIcon(EditIcon),

          props: {
            onClick: () => {
              editProfile.value = !editProfile.value;
            },
          },
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
    Profile,
    NModal,
    UserInfoInput,
    NCard,
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

.cross-con {
  position: absolute;
  top: 3%;
  left: 91%;
  z-index: 5;
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

</style>
