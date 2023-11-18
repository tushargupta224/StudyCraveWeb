<template>
  <div class="video-item" :class="{ 'mic-on': audioActive }">
    <video
      autoplay
      playsinline
      ref="video"
      :id="videoItem.id"
      style="width: 101%; height: 100%; transform: scaleX(-1)"
    ></video>

    <div style="top: 6px; right: 4px; position: absolute">
      <div class="mic-icon" :class="{ green: participant.audioEnabled }">
        <MicOutline
          style="color: white"
          v-if="participant.audioEnabled"
          class="icon"
        />
        <MicOffOutline style="color: white" v-else class="icon" />
      </div>
    </div>

    <div
      style="
        bottom: 4px;
        left: 4px;
        position: absolute;
        color: white;
        border-radius: 99px;
        backdrop-filter: blur(40px);
        background-color: rgba(255, 255, 255, 0.2);
        padding: 4px 6px;
        padding-right: 12px;
      "
    >
      <div style="display: flex; justify-content: center; align-items: center">
        <div
          style="
            width: 25px;
            height: 25px;
            border-radius: 50%;
            border: 1px solid #fdfe02;
            background-color: transparent;
            margin-right: 5px;
            overflow: hidden;
          "
        >
          <img
            :src="participant.userAvatar"
            style="width: 100%; height: 100%"
          />
        </div>

        {{ participant.userName }}
      </div>
    </div>
    <div
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        background: white;
      "
      v-if="!participant.videoEnabled"
    >
      <img
        :src="participant.userAvatar"
        alt="img"
        style="width: 100%; height: 100%; filter: blur(4px)"
      />
      <img
        :src="participant.userAvatar"
        alt="img"
        style="
          position: absolute;
          z-index: 5;
          width: 100%;
          height: 100%;
          filter: blur(15px);
        "
      />

      <div
        style="
          position: absolute;
          z-index: 10;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "
      >
        <img
          :src="participant.userAvatar"
          alt="dp"
          style="width: 80px; height: 80px; border-radius: 50%"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType, toRefs, onMounted, onBeforeUnmount } from "vue";
import type { ISessionParticipants } from "../../types/channels/ISessionParticipants";
import { MicOffOutline, MicOutline } from "@vicons/ionicons5";

const props = defineProps({
  videoItem: {
    type: Object as PropType<any>,
    required: true,
  },
  participant: {
    type: Object as PropType<ISessionParticipants>,
    required: true,
  },
});

const { videoItem } = toRefs(props);

const video = ref();

const audioActive = ref<boolean>(false);
const audioContext = ref<AudioContext>();
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

onBeforeUnmount(() => {
  mounted.value = false;
  if (audioContext.value) {
    audioContext.value.close();
  }
});

const setStreamObject = (stream: MediaStream) => {
  if (videoItem.value.id === stream.id) video.value.srcObject = stream;
  createAudioAnalyser();
};

const createAudioAnalyser = () => {
  const audioContextLocal = new (window.AudioContext ||
    (window as any)?.webkitAudioContext)();
  const analyser = audioContextLocal.createAnalyser();
  const source = audioContextLocal.createMediaElementSource(video.value);

  source.connect(analyser);
  analyser.connect(audioContextLocal.destination);

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const update = () => {
    if (mounted) {
      analyser.getByteFrequencyData(dataArray);
      const average =
        dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;

      if (average > 10) {
        audioActive.value = true;
      } else {
        audioActive.value = false;
      }
    }

    requestAnimationFrame(update);
  };

  update();
  audioContext.value = audioContextLocal;
};

defineExpose({ setStreamObject });
</script>

<style scoped lang="scss">
.video-item {
  background-color: transparent;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px;
  width: 386px;
  height: 290px;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  border: 2px solid #363062;

  &.mic-on {
    border: 2px solid #ffc72c;
    box-shadow: #ffc72c 0px 0px 50px;
  }
}

.mic-icon {
  width: 36px;
  height: 36px;
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

  .icon {
    width: 24px;
  }

  &.green {
    background-color: #355e3b;
  }
}
</style>
