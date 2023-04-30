<template>
  <div class="timer-container">
    <n-space class="timer">
      <h5 class="h5">Personal Timer</h5>
      <span style="font-variant-numeric: tabular-nums">
        <n-countdown ref="countDown" :duration="3000000" :active="active" />
      </span>
      <div style="display: flex; justify-content: space-between">
        <n-button
          size="small"
          type="default"
          @click="handleReset"
          style="z-index: 3 !important; color: white;"
        >
          Reset
        </n-button>
        <n-switch v-model:value="active" style="margin-bottom: 20px"></n-switch>
      </div>
    </n-space>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import { NSpace, NCountdown, NButton, NSwitch } from "naive-ui";
import type { CountdownInst } from "naive-ui";

export default defineComponent({
  setup() {
    const activeRef = ref(true);
    const countdownRef = ref<CountdownInst | null>();

    function handleReset() {
      countdownRef.value?.reset();
    }
    return {
      active: activeRef,
      countDown: countdownRef,
      handleReset,
    };
  },
  components: {
    NButton,
    NCountdown,
    NSpace,
    NSwitch,
  },
});
</script>
<style lang="scss" scoped>
.timer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 156.8px;
  color: white;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(17, 25, 40, 0.75);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.125);
  margin-top: 1%;
  margin-left: 35%;
  z-index: 2;
  position: fixed;
}
.timer {
  display: flex !important;
  flex-direction: column !important;
  row-gap: 20px !important;
  z-index: 2;
}

.h5 {
  margin: 0;
  padding: 0;
  margin-top: 5px;
  z-index: 2;
}

span {
  margin-top: 12px;
  font-size: 2rem;
  font-weight: bold;
  z-index: 2;
}
</style>
