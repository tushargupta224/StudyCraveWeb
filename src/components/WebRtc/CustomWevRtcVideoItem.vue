<template>
  <div class="video-item">
    <video
      autoplay
      playsinline
      ref="video"
      :muted="videoItem.muted"
      :id="videoItem.id"
      style="width: 100%; height: 100%; transform: scaleX(-1)"
    ></video>

    <div
      style="
        bottom: 3%;
        left: 50%;
        position: absolute;
        color: white;
        transform: translateX(-50%);
        border-radius: 12px;
        backdrop-filter: blur(14px);
        background-color: rgba(255, 255, 255, 0.2);
        padding: 2px 5px;
      "
    >
      <div style="display: flex; justify-content: center; align-items: center">
        <div
          style="
            width: 25px;
            height: 25px;
            border-radius: 50%;
            border: 1px solid white;
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
import { ref, type PropType, toRefs } from "vue";
import type { ISessionParticipants } from "../../types/channels/ISessionParticipants";

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

const setStreamObject = (stream: MediaStream) => {
  if (videoItem.value.id === stream.id) video.value.srcObject = stream;
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
</style>
