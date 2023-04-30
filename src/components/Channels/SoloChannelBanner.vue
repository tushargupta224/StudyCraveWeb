<template>
  <div class="private-channel-container">
    <div class="live-container">
      <div class="circle"></div>
      <h3 class="live">Live</h3>
    </div>
    <div>
      <h3
        style="
          color: aliceblue;
          padding: 0;
          margin: 0px;
          margin-top: 10px;
          color: whitesmoke;
          text-shadow: -1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000,
            -1px -1px 0 #000;
          font-size: 1.2rem;
        "
      >
        Start Solo Study
      </h3>
      <h4
        style="
          color: cornsilk;
          margin: 0;
          margin-left: -120px;
          margin-top: 12px;
          text-shadow: -1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000,
            -1px -1px 0 #000;
          font-size: 1.2rem;
          font-size: 0.8rem;
          font-style: italic;
        "
      >
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat
        voluptatem in unde minima!
      </h4>
    </div>
    <div
      style="
        display: flex;
        align-items: end;
        margin-bottom: 12px;
        position: relative;
        right: -44%;
      "
    >
      <n-button type="primary" @click="startButtonHandler"
        >Start Session</n-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NButton } from "naive-ui";

export default defineComponent({
  name: "SoloChannelBanner",
  components: {
    NButton,
  },
  methods: {
    startButtonHandler() {
      this.$router.replace("/private-channel");
    },
  },
});
</script>

<style lang="scss" scoped>
.private-channel-container {
  display: flex;
  gap: 20px;
  width: 1350px;
  height: 200px;
  background-image: url("https://images.pexels.com/photos/3704611/pexels-photo-3704611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2");
  background-position: center;
  background-origin: content-box;
  background-repeat: no-repeat;
  margin: auto;
  margin-bottom: 20px;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  transition: transform 0.2s ease-in-out;
}
.private-channel-container:hover {
  transform: scale(1.05);
}

.live-container {
  width: 80px;
  height: 24px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 45px;
  position: relative;
  top: 10px;
  border-radius: 10px;
}
.live {
  font-size: 0.6rem;
  color: green;
}
</style>
