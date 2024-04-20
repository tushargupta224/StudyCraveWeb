<template>
  <div class="timer-container">
    <close-outline
      style="
        width: 20px;
        height: 20px;
        position: absolute;
        top: 5px;
        right: 5px;
      "
      @click="closeTimer"
    />
    <div class="increaseDecrease">
      <p @click="decrease15mins">-15 mins</p>
      <p @click="decrease30mins">-30 mins</p>
      <p @click="decrease60mins">-1 hour</p>
    </div>
    <n-space class="timer">
      <div style="position: relative">
        <span
          style="
            font-variant-numeric: tabular-nums;
            position: absolute;
            top: 28%;
            left: 50%;
            transform: translate(-50%, 0%);
            font-size: 1.4rem;
          "
        >
          <n-countdown ref="countDown" :duration="duration" :active="active" />
        </span>
        <!-- Circular progress bar -->
        <n-progress
          type="circle"
          :percentage="progressPercentage"
          :show-indicator="false"
          :stroke-width="4"
          style="width: 120px; height: 120px; transform: rotate(180deg)"
          color="#FDD199"
          rail-color="#383838"
        />
        <n-switch
          v-model:value="active"
          :rail-style="
            ({ _f, c }) => {
              if (active) return { background: '#FDD199' };

              return { background: '#EFEFEF' };
            }
          "
          style="
            margin-bottom: 20px;
            position: absolute;
            left: 50%;
            top: 60%;
            transform: translateX(-50%);
          "
        ></n-switch>
      </div>
    </n-space>
    <div class="increaseDecrease">
      <p @click="increase15mins">+15 mins</p>
      <p @click="increase30mins">+30 mins</p>
      <p @click="increase60mins">+1 hour</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

import { CloseOutline } from "@vicons/ionicons5";
import { NSpace, NCountdown, NButton, NSwitch, NProgress } from "naive-ui";
import type { CountdownInst } from "naive-ui";

export default defineComponent({
  setup(props, { emit }) {
    const activeRef = ref(true);
    const countdownRef = ref<CountdownInst | null>();
    const duration = 3000000; // 50 minutes in milliseconds
    const currentTime = ref(duration);

    function handleReset() {
      countdownRef.value?.reset();
      currentTime.value = duration;
    }

    const progressPercentage = ref(100);

    function updateProgress() {
      setInterval(() => {
        if (activeRef.value && currentTime.value > 0) {
          currentTime.value -= 1000; // decrease current time by 1 second
          progressPercentage.value = (currentTime.value / duration) * 100;
        }
      }, 1000);
    }

    updateProgress();

    const formattedTime = computed(() => {
      const minutes = Math.floor(currentTime.value / 60000);
      const seconds = Math.floor((currentTime.value % 60000) / 1000);
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    });

    function closeTimer() {
      emit("close");
    }

    return {
      active: activeRef,
      countDown: countdownRef,
      handleReset,
      progressPercentage,
      formattedTime,
      duration,
      closeTimer,
    };
  },
  emits: ["close"],
  components: {
    NButton,
    NCountdown,
    NSpace,
    NSwitch,
    NProgress,
    CloseOutline,
  },
  methods: {
    increase15mins() {
      this.duration += 900000;
    },
    increase30mins() {
      this.duration += 1800000;
    },
    increase60mins() {
      this.duration += 3600000;
    },
    decrease15mins() {
      if (this.duration >= 900000) {
        this.duration -= 900000;
      }
    },
    decrease30mins() {
      if (this.duration >= 1800000) {
        this.duration -= 1800000;
      }
    },
    decrease60mins() {
      if (this.duration >= 3600000) {
        this.duration -= 3600000;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Text&family=DM+Sans:opsz@9..40&family=Mandali&display=swap");
.timer-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 330px;
  height: 150px;
  color: white;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(252, 252, 252, 0.12);
  border-radius: 12px;
  position: relative;
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

.timer-text {
  font-size: 1.2rem;
  font-weight: bold;
  z-index: 2;
}

.increaseDecrease {
  p {
    font-size: 12px;
    cursor: pointer;
  }
}

@media all and (max-width: 601px) {
  .timer-container {
    top: 25%;
    margin-left: 27%;
    z-index: 1;
    max-width: 270px;
  }
  .h5 {
    margin-top: 0px;
    padding: 0;
  }

  .timer {
    row-gap: 10px !important;
  }
}
</style>
