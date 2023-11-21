<template>
  <div style="padding: 2rem">
    <NavBar />
    <div style="text-align: center">
      <p class="heading">
        Discover the top YouTube playlists that matches your interests!
      </p>
      <p class="sub-heading">
        Begin your studies now to achieve your aspirations.
      </p>
    </div>
    <div class="recommend-container">
      <div
        class="recommend-card"
        v-for="playlist in playlists"
        :key="playlist.play_id"
      >
        <img :src="playlist.thumbnail_link" :alt="playlist.title" />
        <div style="width: 100%; height: 80px; overflow: hidden">
          <h1 class="video-heading">{{ playlist.title }}</h1>
        </div>

        <div style="width: 100%; display: flex; justify-content: space-between">
          <p class="video-count">{{ playlist.videoCount }} videos</p>
          <button
            @click="handleClick(playlist.play_id)"
            class="banner_slider__button"
          >
            View Playlist
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import type { Ref } from "vue";
import { useMessage } from "naive-ui";

import axios from "axios";

import NavBar from "../components/NavBar.vue";
import type YtPlaylist from "@/types/yt/yt_playlist";
import { useAuthStore } from "@/stores/auth";

interface State {
  playlists: Ref<YtPlaylist[]>;
  apiUrl: Ref<string>;
  api_Key: Ref<string | undefined>;
  apiParams: Record<string, string>;
}

export default defineComponent({
  name: "YoutubeRecommendation",
  setup() {
    const message = useMessage();
    const { user } = useAuthStore();

    let keywords = user?.interests;

    const state: State = {
      playlists: ref<YtPlaylist[]>([]),
      apiUrl: ref("https://yt-api-deploy-production.up.railway.app/api/yt_play_recom"),
      api_Key: ref(import.meta.env.VITE_YOUTUBE_RECOMMENDATION_API_KEY as string),
      apiParams: {
        count: "4",
      },
    };

    const getPlayList = async (keyword: string) => {
      try {
        const response = await axios.get(state.apiUrl.value, {
          params: {
            api_key: state.api_Key.value,
            ...state.apiParams,
            keyword,
          },
        });

        let data = response.data;
        console.log(data);
        if (data != null && data)
          data.forEach((item: any) => {
            state.playlists.value.push(item as YtPlaylist);
          });
      } catch (error) {
        console.log(error);
      }
      console.log(state.playlists.value);
    };
    onMounted(() => {
      keywords?.forEach((Keyword) => getPlayList(Keyword));
    });
    return {
      playlists: state.playlists.value,

      message,
    };
  },

  methods: {
    handleClick(index: any) {
      let playlistLink = `https://www.youtube.com/playlist?list=${index}`;
      // navigator.clipboard
      //   .writeText(playlistLink)
      //   .then(() => {
      //     console.log(playlistLink);
      //     this.message.success("PlayList link Copied to Clipboard");
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
      // this.$router.push({
      //   name: "youtube-video",
      //   params: { VideoId: index },
      // });
      window.open(playlistLink, '_blank');
      console.log(index);
    },
  },
  components: {
    NavBar,
  },
});
</script>

<style lang="scss" scoped>
.heading {
  font-size: 1.2rem;
  font-weight: bold;
  background-clip: text;
  background: -webkit-linear-gradient(#1a2a6c, #b21f1f, #fdbb2d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.sub-heading {
  font-style: italic;
  font-style: 1rem;
}

.playlist {
  display: flex;
  border: 1px solid black;
}
.recommend-container {
  display: flex;
  justify-content: space-between;
  align-self: center;
  flex-wrap: wrap;
  border-radius: 25px;
  margin-top: 25px;
}
.recommend-card {
  width: 300px;
  border-radius: 25px;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  transition: transform 0.2s ease-in-out;
  margin-bottom: 25px;
  padding: 25px;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
  }
}
.recommend-card img {
  width: 100%;
  border-radius: 25px;
}

.video-heading {
  font-size: 1.2rem;
}
.video-subheading {
  font-style: italic;
  font-size: 1rem;
  font-weight: bold;
}

.banner_slider__button {
  display: inline-flex;
  background-image: linear-gradient(147deg, #fe8a39 0%, #fd3838 74%);
  padding: 0px 25px;
  height: 35px;
  text-align: center;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  color: #fff;
  box-shadow: 0px 14px 80px rgba(252, 56, 56, 0.4);
  text-decoration: none;
  font-weight: 500;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  border: none;
  letter-spacing: 1px;
  @media screen and (max-width: 576px) {
    width: 100%;
  }
}
</style>
