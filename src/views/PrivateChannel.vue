<template>
  <div
    style="background-color: black; height: 100vh"
    class="main-container"
    :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
  >
    <Player v-if="videoId" :video-id="videoId" />

    <div
      style="
        width: 90%;
        height: 80px;
        background-color: transparent;
        margin: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <div
        style="
          display: flex;
          gap: 60px;
          margin: 0 120px;
          justify-content: space-evenly;
          width: 100%;
        "
      >
        <div
          style="
            width: 45px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 3%;
            color: white;
            cursor: pointer;
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            background-color: rgba(17, 25, 40, 0.75);
            border-radius: 8px;
            border: 1px solid white;
            z-index: 2;
          "
          @click="showTodoHandler"
        >
          <ClipboardOutline class="icon" />
        </div>
        <div
          style="
            width: 45px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 3%;
            color: white;
            cursor: pointer;
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            background-color: rgba(17, 25, 40, 0.75);
            border-radius: 8px;
            border: 1px solid white;

            z-index: 2;
          "
          @click="timerShowHandler"
        >
          <TimerOutline class="icon" />
        </div>
        <!-- <div
          style="
            width: 45px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 3%;
            color: white;
            cursor: pointer;
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            background-color: rgba(17, 25, 40, 0.75);
            border-radius: 8px;
            border: 1px solid white;

            z-index: 2;
          "
          @click="toggleMute"
        >
          <VolumeMuteOutline class="icon" />
        </div> -->
        <div
          style="
            width: 45px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 3%;
            color: white;
            cursor: pointer;
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            background-color: rgba(17, 25, 40, 0.75);
            border-radius: 8px;
            border: 1px solid white;

            z-index: 2;
          "
          @click="showBackgroundDivHandler"
        >
          <ImageOutline class="icon" />
        </div>
        <div
          style="
            width: 45px;
            height: 40px;
            margin-left: 3%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            cursor: pointer;
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            background-color: rgba(17, 25, 40, 0.75);
            border-radius: 8px;
            border: 1px solid white;
            z-index: 2;
          "
          @click="showFormHandler"
        >
          <PlayOutline class="icon" />
        </div>
      </div>
      <div></div>
    </div>
    <div class="helper-container">
      <ToDo v-if="showToDo" />
      <timer v-show="showTimer" />
    </div>
    <VideoInput v-if="showForm" @submit="handleFormSubmit" />
    <Background @image-selected="setBackgroundImageUrl" v-if="showBackground" />

    <Loading v-if="showModal" class="loading">
      <template v-slot:body>
        <div class="heading">Are you sure you want to exit?</div>
        <p>The timer will start again from 50min.</p>
        <div class="confirmation">
          <button @click="yesButtonhandler">Yes</button>
          <button @click="noButtonHandler">No</button>
        </div>
      </template></Loading
    >

    <div class="logout" @click="logoutButtonHandler">
      <LogOutOutline />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

import Timer from "@/components/Helper/Timer.vue";
import ToDo from "@/components/Helper/ToDo.vue";
import Loading from "@/components/Loading.vue";
import Player from "../components/Helper/Player.vue";
import VideoInput from "../components/Helper/VideoInput.vue";
import Background from "../components/Helper/Background.vue";

import router from "../router/index";

import {
  TimerOutline,
  ClipboardOutline,
  LogOutOutline,
  PlayOutline,
  VolumeMuteOutline,
  ImageOutline,
} from "@vicons/ionicons5";

export default defineComponent({
  name: "private-channel",
  setup() {
    const videoId = ref<string | null>(null);

    function handleFormSubmit(newVideoId: string) {
      if (newVideoId && typeof newVideoId === "string") {
        videoId.value = newVideoId;
      }
    }
    return {
      videoId,
      handleFormSubmit,
    };
  },
  components: {
    Timer,
    TimerOutline,
    ToDo,
    ClipboardOutline,
    LogOutOutline,
    Loading,
    Player,
    PlayOutline,
    VideoInput,
    VolumeMuteOutline,
    Background,
    ImageOutline,
  },
  data() {
    return {
      showTimer: true,
      showToDo: true,
      showModal: false,
      showForm: true,
      videoId: null,
      backgroundImageUrl: "",
      showBackground: false,
    };
  },

  methods: {
    timerShowHandler() {
      this.showTimer = !this.showTimer;
    },
    showTodoHandler() {
      this.showToDo = !this.showToDo;
    },
    logoutButtonHandler() {
      this.showModal = true;
    },
    noButtonHandler() {
      this.showModal = false;
    },
    yesButtonhandler() {
      router.replace("/home");
    },
    showFormHandler() {
      this.showForm = !this.showForm;
    },
    setBackgroundImageUrl(imageurl: any) {
      this.backgroundImageUrl = imageurl;
    },
    showBackgroundDivHandler(){
      this.showBackground = !this.showBackground;
    }
  },
});
</script>

<style lang="scss" scoped>
.main-container {
  background-size: cover;
  background-repeat: no-repeat;
}
.loading {
  z-index: 2 !important;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.helper-container {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  z-index: 2;
}
.heading {
  font-size: 1.6rem;
  font-weight: bold;
  z-index: 2;
}
p {
  font-style: italic;
  font-size: 1rem;
  margin-top: 1px;
  z-index: 2;
}
.confirmation {
  width: 200px;
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;
  z-index: 2;
}
.confirmation button {
  width: 85px;
  height: 30px;
  padding: 12px;
  padding-top: 3px;
  border: 2px solid black;
  background-color: rgb(234, 199, 73);
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  z-index: 200 !important;
}
.icon {
  height: 25px;
  // margin-top: 5px;
  // margin-left: 5px;
}
.logout {
  width: 40px;
  height: 40px;
  position: absolute;
  border-radius: 8px;
  padding: 8px;
  color: white;
  bottom: 10%;
  right: 5%;
  background-color: rgb(71, 3, 95);
  cursor: pointer;
  z-index: 2;
}
</style>
