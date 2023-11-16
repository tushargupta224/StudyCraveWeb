<!-- VideoCall.vue -->

<template>
  <div>
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
    <button @click="toggleAudio">Toggle Audio : {{ audioEnable }}</button>
    <button @click="toggleVideo">Toggle Video : {{ videoEnable }}</button>
    <button @click="leaveCall">Leave Call</button>
  </div>
</template>

<script lang="ts">
import CustomWebRtc from "../WebRtc/CustomWebRtc.vue";
import { useChatStore } from "../../stores/chat";
import { defineComponent } from "vue";
// Adjust the path based on your project structure

export default defineComponent({
  name: "ChatCollabrateSession",
  components: {
    "custom-webrtc": CustomWebRtc,
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
