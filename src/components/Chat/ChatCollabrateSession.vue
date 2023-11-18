<!-- VideoCall.vue -->

<template>
  <div style="position: relative">
    <custom-webrtc
      ref="webrtc"
      width="100%"
      :roomId="chatStore.channel!.id"
      socketURL="https://localhost:3009/"
      :enableLogs="true"
      v-model:audio-enabled="audioEnable"
      v-model:video-enabled="videoEnable"
      v-on:joined-room="onJoined"
      v-on:left-room="logEvent"
      v-on:opened-room="logEvent"
      v-on:share-started="logEvent"
      v-on:share-stopped="logEvent"
      @error="onError"
    />
    <div class="btn-containe">
      <button @click="toggleAudio" class="c-control">
        <MicOutline style="color: white" v-if="audioEnable" class="icon"/>
        <MicOffOutline style="color: white" v-else  class="icon"/>
      </button>
      <button @click="leaveCall" class="c-control--end-call">
        <CallOutline class="icon"/>
      </button>
      <button @click="toggleVideo" class="c-control">
        <VideocamOutline style="color: white" v-if="videoEnable" class="icon"/>
        <VideocamOffOutline style="color: white" v-else  class="icon"/>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import CustomWebRtc from "../WebRtc/CustomWebRtc.vue";
import { useChatStore } from "../../stores/chat";
import { defineComponent } from "vue";

import { MicOffOutline, CallOutline, VideocamOutline, MicOutline, VideocamOffOutline } from "@vicons/ionicons5";
// Adjust the path based on your project structure

export default defineComponent({
  name: "ChatCollabrateSession",
  components: {
    "custom-webrtc": CustomWebRtc,
    MicOutline,
    MicOffOutline,
    CallOutline,
    VideocamOutline,
    VideocamOffOutline,
  },
  setup() {
    const chatStore = useChatStore();

    return { chatStore };
  },
  data() {
    return {
      img: null,
      audioEnable: true,
      videoEnable: true,
    };
  },
  mounted() {
    this.onJoin();
  },
  computed: {
    shouldReJoinAutomatically() {
      return [this.audioEnable, this.videoEnable];
    },
  },
  methods: {
    leaveCall() {
      try {
        // Leave the call using the chat store
        this.chatStore.leaveVideoCall();
        this.onLeave();
      } catch (error) {
        console.error("Error leaving call:", error);
      }
    },
    callEnded() {
      // Additional logic when the call ends
      console.log("Call ended.");
    },
    onCapture() {
      this.img = (this.$refs.webrtc as any).capture();
    },
    onJoin() {
      (this.$refs.webrtc as any).join();
    },
    onLeave() {
      (this.$refs.webrtc as any).leave();
    },
    onShareScreen() {
      this.img = (this.$refs.webrtc as any).shareScreen();
    },
    onError(error, stream) {
      console.log("On Error Event", error, stream);
    },
    onJoined(mediaId: string) {
      this.chatStore.joinVideoCall(mediaId);
    },
    logEvent(event) {
      console.log("Event : ", event);
    },
    toggleAudio() {
      // this.audioEnable = !this.audioEnable;
      (this.$refs.webrtc as any).toggleLocalMic();
    },
    toggleVideo() {
      // this.videoEnable = !this.videoEnable;
      (this.$refs.webrtc as any).toggleLocalVideo();
    },
  },
  beforeUnmount() {
    this.leaveCall();
  },
});
</script>

<style lang="scss">
.btn-containe {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 300px;
  border-radius: 8px;
  backdrop-filter: blur(14px);
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
}
.c-control {
  z-index: 2;
  width: 40px;
  height: 40px;
  border-radius: 100rem;
  border: 0;
  color: white;
  font-size: 18px;
  background: transparent;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #ccc;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: inherit;
    height: inherit;
    // box-shadow: inset 0 0 2000px rgba(255, 255, 255, 0.5);
    // filter: blur(10px);
  }

  &--end-call {
    width: 40px;
    height: 40px;
    background-color: rgb(224, 52, 52);
    border-radius: 30px;
    border: 0;

    color: white;
    font-size: 13px;
    box-shadow: rgba(252, 93, 91, 0.7) 0px 7px 29px 0px;
    cursor: pointer;
  }
  &--end-call:hover {
    background-color: red;
  }
}

.icon{
  width: 25px;
}
</style>
