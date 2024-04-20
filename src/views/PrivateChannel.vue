<template>
  <div
    style="background-color: black; min-height: 100vh"
    class="main-container"
    :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
  >
    <Player v-if="videoId" :video-id="videoId" />
    <div class="more" @click="moreClickHandler">
      <div class="line line1"></div>
      <div class="line line2"></div>
      <div class="line line3"></div>
    </div>

    <div
      style="
        width: 95%;
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
          justify-content: space-between;
          width: 100%;
        "
        class="nav-container"
        v-if="showContainer"
      >
        <div style="display: flex; gap: 16px" class="nav2">
          <div class="icon-container" @click="showTodoHandler">
            <img src="@/assets/icons/taskListIcon.svg" class="icon" />
          </div>
          <div class="icon-container" @click="timerShowHandler">
            <img src="@/assets/icons/timerIcon.svg" class="icon" />
          </div>
          <div class="icon-container" @click="showBackgroundDivHandler">
            <img src="@/assets/icons/mediaIcon.svg" class="icon" />
          </div>
        </div>
        <div class="yt icon-container" @click="showFormHandler">
          <img src="@/assets/icons/yt.svg" class="icon" style="height: 50px" />
        </div>
      </div>
      <div></div>
    </div>
    <div class="helper-container">
      <div class="column">
        <timer v-show="showTimer" @close="timerShowHandler" />
        <ToDo v-if="showToDo" @close="showTodoHandler" />
      </div>
      <Background
        :style="{
          'margin-left': !showTimer && !showToDo ? '-12px' : '0px',
          'max-height': '500px'
        }"
        v-model:selected-image="backgroundImageUrl"
        v-if="showBackground"
        @close="showBackgroundDivHandler"
        
      />
    </div>

    <VideoInput
      v-if="showForm"
      @submit="handleFormSubmit"
      @close="showFormHandler"
    />

    <!-- <div v-if="showModal" class="modal">
      <template v-slot:body>
        <div class="heading">Are you sure you want to exit?</div>
        <p>The timer will start again from 50min.</p>
        <div class="confirmation">
          <button @click="yesButtonhandler">Yes</button>
          <button @click="noButtonHandler">No</button>
        </div>
      </template>
    </div> -->

    <div v-if="showModal" class="modal">
      <div class="modalCon">
        <div class="heading">
          Are you sure you want to exit solo study mode?
        </div>
        <p>
          Any unsaved changes will be lost, and the timer will restart when you
          return.
        </p>
        <div class="confirmation">
          <button @click="noButtonHandler" class="no">Cancel</button>
          <button @click="yesButtonhandler" class="yes">Exit</button>
        </div>
      </div>
    </div>

    <div class="backdrop" v-if="showModal"></div>

    <div class="logout" @click="logoutButtonHandler">
      <LogOutOutline style="width: 25px; height: 25px" />
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

import { LogOutOutline, PlayOutline } from "@vicons/ionicons5";

import router from "../router/index";

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
    ToDo,
    Loading,
    Player,
    VideoInput,
    Background,
    LogOutOutline,
    PlayOutline,
  },
  data() {
    return {
      showTimer: window.innerWidth > 1025 ? true : false,
      showToDo: window.innerWidth > 1025 ? true : false,
      showModal: false,
      showForm: window.innerWidth > 1025 ? true : false,
      videoId: null,
      backgroundImageUrl: "",
      showBackground: false,
      windowWidth: window.innerWidth,
      showContainer: window.innerWidth < 601 ? false : true,
    };
  },

  methods: {
    timerShowHandler() {
      this.showTimer = !this.showTimer;
      if (window.innerWidth < 1025) {
        this.showToDo = false;
        this.showForm = false;
        this.showBackground = false;
      }
    },
    showTodoHandler() {
      this.showToDo = !this.showToDo;
      if (window.innerWidth < 1025) {
        this.showTimer = false;
        this.showForm = false;
        this.showBackground = false;
      }
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
      if (window.innerWidth < 1025) {
        this.showToDo = false;
        this.showTimer = false;
        this.showBackground = false;
      }
    },
    setBackgroundImageUrl(imageurl: any) {
      this.backgroundImageUrl = imageurl;
    },
    showBackgroundDivHandler() {
      this.showBackground = !this.showBackground;
      if (window.innerWidth < 1025) {
        this.showToDo = false;
        this.showForm = false;
        this.showTimer = false;
      }
    },
    moreClickHandler() {
      this.showContainer = !this.showContainer;
    },
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
  gap: 12px;
  flex-wrap: wrap;
  z-index: 2;
  max-width: 95%;
  margin: auto;
  position: relative;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal {
  width: 600px;
  padding: 24px;
  position: absolute;
  border-radius: 24px;
  top: 50%;
  box-sizing: border-box;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  z-index: 8;
}

.modalCon {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-direction: column;
}
.heading {
  font-size: 20px;
  font-weight: bold;
  z-index: 2;
  text-align: center;
  margin-bottom: 12px;
}
p {
  font-size: 14px;
  margin-top: 1px;
  z-index: 2;
  text-align: center;
  width: 80%;
  margin: auto;
}
.confirmation {
  width: 50%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  box-sizing: border-box;
 
  z-index: 2;
}
// .confirmation button {
//   width: 85px;
//   height: 30px;
//   padding: 12px;
//   padding-top: 3px;
//   border: 2px solid black;
//   background-color: rgb(234, 199, 73);
//   border-radius: 12px;
//   cursor: pointer;
//   font-size: 1.2rem;
//   font-weight: bold;
//   z-index: 200 !important;
// }

.confirmation .no {
  // padding: 12px 24px;
  width: 182px;
  height: 54px;
  border-radius: 99px;
  border: 2px solid black;
  background-color: transparent;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.confirmation .yes {
  // padding: 12px 24px;
  width: 182px;
  height: 54px;
  border-radius: 99px;
  background-color: #fdd199;
  font-size: 16px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-left: 24px;
}

.backdrop {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 6;
  background-color: rgba(150, 150, 150, 0.45);
}

.icon-container {
  width: 60px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  cursor: pointer;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: #fdd199;
  border-radius: 8px;
  z-index: 2;
}

.icon {
  height: 25px;
  z-index: 1;
}
.logout {
  width: 40px;
  height: 40px;
  position: absolute;
  border-radius: 16px;
  padding: 8px;
  color: white;
  bottom: 24px;
  right: 24px;
  background-color: #2f2e41;
  box-shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)';
  cursor: pointer;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
.more {
  display: none;
}

@media all and (max-width: 601px) {
  .main-container {
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
  }
  .nav-container {
    display: flex;
    flex-direction: column;
    position: relative;
    top: 300%;
    align-items: center;
    left: -40%;
    z-index: 8;
  }
  .nav2 {
    flex-direction: column;
  }
  .logout {
    right: 10%;
    width: 30px;
    height: 30px;
  }

  .line {
    font-weight: 600;
    color: white;
    margin-left: 10px;
  }
  .line1 {
    width: 30px;
    border: 1px solid white;
    margin-bottom: 6px;
  }
  .line2 {
    width: 20px;
    border: 1px solid white;
    margin-bottom: 6px;
  }
  .line3 {
    width: 10px;
    border: 1px solid white;
  }
  .more {
    width: 45px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    margin-left: 3%;
    color: white;
    cursor: pointer;
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    background-color: rgba(17, 25, 40, 0.75);
    border-radius: 8px;
    border: 1px solid white;
    z-index: 2;
    position: absolute;
    left: 3%;
    top: 6%;
  }
  .bg {
    top: 0 !important;
  }
  .yt {
    margin-left: 0 !important;
  }
}
</style>
