<template>
  <div class="layer"></div>
  <div class="plyr_video-embed" id="player">
    <iframe
      v-if="videoId"
      width="100%"
      height="100%"
      class="iframe"
      :src="`https://www.youtube-nocookie.com/embed/${getYouTubeId(
        videoId
      )}?autoplay=1`"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Player",
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  methods: {
    getYouTubeId(url: string): string | null {
      // Regular expression to match YouTube URLs
      const youtubeRegex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

      // Extract the video ID using the regex
      const match = url.match(youtubeRegex);

      // If a match was found, return the video ID
      if (match) {
        return match[1];
      }

      // If no match was found, return null
      return null;
    },
  },
});
</script>

<style>
.plyr_video-embed {
  width: 100vw;
  height: 100vh;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.iframe {
  position: absolute;
  top: 1%;
  z-index: 0;
  margin-top: -60px;
}
.layer {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: transparent;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
