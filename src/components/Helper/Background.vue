<template>
  <div class="img-parent">
    <h2>Choose the Background of the screen.</h2>
    <div
      class="img-container"
      v-for="(image, id) in images"
      :key="id"
      :style="{ backgroundImage: `url(${image.img})` }"
      @click="selectedImg(image.img)"
    ></div>
  </div>
</template>
<script lang="ts">
export default {
  name: "Background",

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
  },
};
</script>
<style scoped lang="scss">
.img-parent {
  width: 300px;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(17, 25, 40, 0.75);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.125);
  color: white;
  position: relative;
  z-index: 3;
  left: 52%;
}
h2 {
  margin-bottom: -50px;
  font-size: 0.8rem;
  padding: 5px;
}
.img-container {
  width: 80px;
  height: 80px;
  border: 1px solid white;
  display: flex;
  justify-content: space-between;
  background-repeat: no-repeat;
  background-position: center center;
  flex-wrap: wrap;
  border-radius: 8px;
  background-size: cover;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  margin-top: 70px;
  //   margin-bottom: 50px;
}
</style>
