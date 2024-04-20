<template>
  <div class="img-parent">
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <h2>Customize Background</h2>
      <close-outline style="width: 20px; height: 20px; cursor: pointer" @click="closeHandler" />
    </div>
    <div class="img-grid">
      <button @click="removeBackgroundImages" class="removeBtn">
        <img src="../../assets/images/eye.svg" alt="eye" />
      </button>
      <div
        class="img-container"
        v-for="(image, id) in images"
        :key="id"
        :style="{ backgroundImage: `url(${image.img})` }"
        @click="selectedImg(image.img)"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { CloseOutline } from "@vicons/ionicons5";

export default {
  name: "Background",
  setup(props, { emit }) {
    function closeHandler() {
      emit("close");
    }

    return { closeHandler };
  },

  data() {
    return {
      images: [
        {
          id: 1,
          img: "https://cdn.videoplasty.com/animation/girl-studying-for-exams-lofi-animation-stock-animation-43556-1280x720.jpg",
        },
        {
          id: 2,
          img: "https://e0.pxfuel.com/wallpapers/1009/997/desktop-wallpaper-of-the-best-lofi-study-girl-redraws-inspired-by-juan-pablo-machado-and-chilledcow-s-iconic-original-cute-background-illustration-art-girl-study-girl-aesthetic-art.jpg",
        },
        { id: 3, img: "https://wallpaperaccess.com/full/1323307.jpg" },
        { id: 4, img: "https://cdn.wallpapersafari.com/80/75/OsxjaN.jpg" },
        {
          id: 5,
          img: "https://s01.sgp1.cdn.digitaloceanspaces.com/article/175184-emgdrgiwsw-1654067445.jpg",
        },
        {
          id: 6,
          img: "https://s01.sgp1.digitaloceanspaces.com/large/838153-58299-aoebnucekh-1494922429.jpg",
        },
        {
          id: 7,
          img: "https://play-lh.googleusercontent.com/proxy/JcENIxd1kUvSa3uBRLcZEU6dIjAspvmU2vpwpP-ptWEIoA-ysh3AExm1GokvXi_L1nkXG5sXuRoGOr_orNxnERdgI75C1FJCQ0YIJ9hrmf25E_slLk5zS90=s1920-w1920-h1080",
        },
        {
          id: 8,
          img: "https://i.ytimg.com/vi/_RG5IUu2qYU/maxresdefault.jpg",
        },
        {
          id: 9,
          img: "https://i2-prod.dailystar.co.uk/incoming/article15314056.ece/ALTERNATES/s1200d/1199959",
        },
      ],
    };
  },

  methods: {
    selectedImg(imageurl: any) {
      this.$emit("image-selected", imageurl);
    },
    removeBackgroundImages() {
      // this.selectedImageIndex = null;
      this.$emit("image-selected", "");
    },
  },
  emits: ["close", "image-selected"],
  components: {
    CloseOutline,
  },
};
</script>
<style scoped lang="scss">
.img-parent {
 
  background-color: rgba(252, 252, 252, 0.12);
  border-radius: 18px;
  color: white;
  position: relative;
  overflow-y: auto;
  padding: 16px;
}
h2 {
  font-size: 0.8rem;
  padding: 0px;
  margin: 0px;
}
.img-container {
  min-width: 100px;
  min-height: 100px;
  max-width: 100px;
  max-height: 100px;
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 8px;
  background-size: cover;
  cursor: pointer;
  z-index: 1;
  box-sizing: border-box;
  position: relative;
}

.img-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Three columns */
  gap: 15px; /* Gap between image containers */
  box-sizing: border-box;
}
.removeBtn {
  background-color: rgba(144, 144, 144, 0.54);
  border-radius: 5px;
  border: none;
  cursor: pointer;
  min-width: 100px;
  min-height: 100px;
  max-width: 100px;
  max-height: 100px;
}
.selected-image {
  border: 2px solid white !important;
}

@media all and (max-width: 601px) {
  .img-parent {
    left: 15%;
    width: 250px;
    // height: 300px;
    overflow-y: scroll;
    background-position: center;
    background-size: cover;
  }
  h2 {
    font-size: 0.6rem;
  }
}
</style>
