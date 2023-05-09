<template>
  <div class="screen-container">
    <iframe
      width="860"
      height="450"
      src="https://www.youtube-nocookie.com/embed/K6WyEgsSYv8"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VideoSection",
});
</script>
<style lang="scss" scoped>
.screen-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
