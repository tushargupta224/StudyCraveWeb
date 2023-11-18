<template>
  <div
    class="live-card"
    :class="{ active: onVideoSession }"
    @click="onVideoSession = !onVideoSession"
  >
    <img
      contain
      style="height: 100%; width: 100%"
      src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/f1d0d572816947.5c2bcd89d519b.gif"
    />
    <div
      style="
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 8%;
      "
    >
      <div
        style="
          padding: 2px 6px;
          border-radius: 32px;
          display: flex;
          align-items: center;
          color: white;
        "
        :style="{
          'background-color': participants.length > 0 ? ' #d80032' : '#36454f',
        }"
      >
        <Headset style="width: 14px; padding-right: 4px" />
        <div class="margin-right: 8px;">{{ participants.length }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { useChatStore } from "../../stores/chat";
import { Headset } from "@vicons/ionicons5";

const { participants, onVideoSession } = toRefs(useChatStore());
</script>

<style scoped lang="scss">
.live-card {
  margin: 12px;
  height: 100px;
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  flex-direction: column;
  align-items: center;
  position: relative;
  &.active {
    border: 3px solid #0c356a;
  }
}
</style>
