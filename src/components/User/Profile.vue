<template>
  <n-modal v-model:show="show">
    <n-card
      style="width: 400px; border-radius: 18px; overflow: hidden"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div class="cross-con" @click="onClose">
        <div class="cross">&#10006;</div>
      </div>
      <div class="circle"></div>
      <div style="padding: 1rem">
        <div class="title-con">
          <span class="title">Profile</span>
        </div>
        <div class="avtar-container">
          <div class="avtar">
            <img :src="userAvatar" alt="Avtar" />
          </div>
        </div>
        <div class="name">
          <span>Display Name</span>
          <div>
            {{ (user?.firstName ?? "") + " " + (user?.lastName ?? "") }}
          </div>
        </div>
        <div class="name">
          <span>Email</span>
          <div>{{ user?.email }}</div>
        </div>
        <div v-if="user?.interests && user?.interests?.length > 0">
          <span>Interests</span>
          <div>
            <n-space>
              <n-tag v-for="interest in user?.interests">{{ interest }}</n-tag>
            </n-space>
          </div>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>

<script lang="ts">
import { useAuthStore } from "@/stores/auth";
import { NModal, NCard, NSpace, NTag } from "naive-ui";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Profile",
  setup() {
    const { user } = useAuthStore();

    return { user };
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    NModal,
    NCard,
    NSpace,
    NTag,
  },
  emits: ["onClose"],
  computed: {
    userAvatar(): string {
        if (this.user?.profilePic)
        return this.user?.profilePic;
      return "https://www.croptecshow.com/wp-content/uploads/2017/04/guest-avatar-250x250px.png";
    },
  },
  methods: {
    onClose() {
      this.$emit("onClose");
    },
  },
});
</script>

<style lang="scss" scoped>
.cross-con {
  position: absolute;
  top: 2%;
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
.cross{
    width: 100%;
    height: 100%;
}
.circle {
  position: absolute;
  width: 800px;
  height: 500px;
  border-radius: 50%;
  background-color: orange;
  top: -432px;
  right: -200px;
  z-index: 0;
}
.avtar-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.avtar {
  width: 100px;
  height: 100px;
  //   background-color: #ccc;
  border-radius: 50%;
  overflow: hidden;
}
.avtar img{
    width: 100%;
    height: 100%;
    object-fit: contain;

}

.name {
  margin-bottom: 12px;
}
span {
  padding: 0 5px;
  font-style: italic;
  font-size: 0.8rem;
  font-weight: 500;
  color: #9b9a9a;
}

.name div {
  border: 1px solid black;
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 1rem;
  font-weight: 500;
}
.title-con {
  margin-top: 30px;
}
.title {
  z-index: 2;
  color: black;
  font-size: 1.3rem;
  font-weight: bold;
}
</style>
