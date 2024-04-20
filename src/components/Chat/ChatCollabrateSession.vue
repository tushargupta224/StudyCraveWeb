<!-- VideoCall.vue -->

<template>
  <div style="position: relative; width: 100%">
    <custom-webrtc
      ref="webrtc"
      width="100%"
      :roomId="chatStore.channel!.id"
      :participants="chatStore.participants"
      socketURL="https://localhost:4000/"
      :enableLogs="true"
      v-model:audio-enabled="audioEnable"
      v-model:video-enabled="videoEnable"
      v-on:joined-room="onJoined"
      v-on:left-room="logEvent"
      v-on:opened-room="logEvent"
      v-on:share-started="logEvent"
      v-on:share-stopped="logEvent"
      @local-audio-status-change="onLocalAudioVideoStatusChange"
      @local-video-status-change="onLocalAudioVideoStatusChange"
      @error="onError"
    />
    <div class="btn-container">
      <button class="c-control">
        <div @click="toggleAudio">
          <MicOutline style="color: white" v-if="audioEnable" class="icon" />
          <MicOffOutline style="color: white" v-else class="icon" />
        </div>
      </button>
      <button @click="leaveCall" class="c-control--end-call">
        <CallOutline class="icon" />
      </button>
      <button class="c-control">
        <div @click="toggleVideo">
          <VideocamOutline
            style="color: white"
            v-if="videoEnable"
            class="icon"
          />
          <VideocamOffOutline style="color: white" v-else class="icon" />
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import CustomWebRtc from "../WebRtc/CustomWebRtc.vue";
import { useChatStore } from "../../stores/chat";
import { defineComponent } from "vue";

import {
  MicOffOutline,
  CallOutline,
  VideocamOutline,
  MicOutline,
  VideocamOffOutline,
} from "@vicons/ionicons5";
import type { ISessionParticipants } from "../../types/channels/ISessionParticipants";
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
      this.chatStore.onVideoSession = false;
    },
    onShareScreen() {
      this.img = (this.$refs.webrtc as any).shareScreen();
    },
    onError(error: any, stream: any) {
      console.log("On Error Event", error, stream);
    },
    onJoined(mediaId: string) {
      this.chatStore.joinVideoCall(mediaId, this.audioEnable, this.videoEnable);
    },
    logEvent(event: any) {
      console.log("Event : ", event);
    },
    toggleAudio() {
      (this.$refs.webrtc as any).toggleLocalMic();
    },
    toggleVideo() {
      (this.$refs.webrtc as any).toggleLocalVideo();
    },
    onLocalAudioVideoStatusChange(t: ISessionParticipants) {
      this.chatStore.updateParticipantConfigStatus(t);
    },
  },
  beforeUnmount() {
    this.leaveCall();
  },
});
</script>

<style scoped lang="scss">
.btn-container {
  position: absolute;
  z-index: 40;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  align-items: center;

  border-radius: 99px;
  backdrop-filter: blur(14px);
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  padding: 4px 8px;
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
  background-color: #36454f;

  &--end-call {
    width: 40px;
    height: 40px;
    background-color: rgb(224, 52, 52);
    border-radius: 30px;
    border: 0;
    margin-inline: 8px;

    color: white;
    font-size: 13px;
    box-shadow: rgba(252, 93, 91, 0.7) 0px 7px 29px 0px;
    cursor: pointer;
  }
  &--end-call:hover {
    background-color: red;
  }
}

.icon {
  width: 25px;
}
</style>
