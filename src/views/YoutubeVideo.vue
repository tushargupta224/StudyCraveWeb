<template>
  <div style="padding: 2rem">
    <NavBar />
  </div>
  <div class="youtube">
    <VideoSideBar />
   <VideoScetion/>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "../components/NavBar.vue";
import VideoSideBar from "../components/VideoSideBar.vue";
import VideoScetion from "../components/VideoScetion.vue";

export default defineComponent({
  name: "YoutubeVideo",
  components: {
    NavBar,
    VideoSideBar,
    VideoScetion,
  },
});
</script>
<style lang="scss" scoped>
.youtube{
    display: flex;
    
}

</style>