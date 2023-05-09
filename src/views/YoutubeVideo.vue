<template>
  <div style="padding: 2rem">
    <NavBar />
  </div>
  <div class="youtube">
    <!-- <VideoSideBar >
      <div v-for="playlist in playVideo" :key="playlist.id">
        <div>{{ playlist.thumbnails }}</div>
        <p>{{ playlist.title }}</p>
        <p>{{ playlist.views }}</p>

      </div>
    </VideoSideBar> -->
    <aside>
      <div v-for="playlist in playVideo" :key="playlist.id">
        <div>{{ playlist.thumbnails }}</div>
        <p>{{ playlist.title }}</p>
        <p>{{ playlist.views }}</p>
      </div>
    </aside>
    <VideoScetion />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import type { Ref } from "vue";
import NavBar from "../components/NavBar.vue";
import VideoSideBar from "../components/VideoSideBar.vue";
import VideoScetion from "../components/VideoScetion.vue";
import type { YtPlaylistVideo } from "@/types/yt/yt_playlist";
import axios from "axios";

interface State {
  playlists: Ref<YtPlaylistVideo[]>;
  apiUrl: Ref<string>;
  api_Key: Ref<string>;
  apiParams: Record<string, string>;
}

export default defineComponent({
  name: "YoutubeVideo",
  setup() {
    const state: State = {
      playlists: ref<YtPlaylistVideo[]>([]),
      apiUrl: ref("https://studycraveytrec.up.railway.app/api/all_vid_of_play"),
      api_Key: ref(" cQsgws_xiQ-c5zeMDSfs7IKlszjOKsOq5_EiEdhGzy4"),
      apiParams: {
        // param1: "PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU",
        // param2: "4",
        playlist_id: "PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU",
      },
    };

    const getPlayListVideo = async () => {
      try {
        const response = await axios.get(state.apiUrl.value, {
          params: {
            api_Key: state.api_Key.value,
            ...state.apiParams,
          },
        });
        let data = response.data;
        console.log(data);
        if (data != null && data)
          data.forEach((item: any) => {
            state.playlists.value.push(item as YtPlaylistVideo);
          });
      } catch (error) {
        console.log(error);
      }
      console.log(state.playlists.value);
    };
    onMounted(() => {
      getPlayListVideo();
    });
    return {
      playVideo: state.playlists.value,
    };
  },
  components: {
    NavBar,
    VideoSideBar,
    VideoScetion,
  },
});
</script>
<style lang="scss" scoped>
.youtube {
  display: flex;
}
aside {
  width: 460px;
  min-height: 85vh;
  background: burlywood;
  border: 1px solid black;
}
</style>
