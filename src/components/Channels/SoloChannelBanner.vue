<template>
  <swiper
    :direction="windowWidth > 768 ? 'vertical' : 'horizontal'"
    :slides-per-view="1"
    :space-between="30"
    :loop="true"
    :pagination="pagination"
    :autoplay="{
      delay: 4500,
      disableOnInteraction: false,
    }"
    :modules="modules"
    :mousewheel="{ invert: false }"
    class="banner_slider"
  >
    <swiper-slide class="banner_slider__item">
      <div class="banner_slider__img">
        <img
          src="https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1535759872/kuldar-kalvik-799168-unsplash.webp"
          alt=""
        />
      </div>
      <div class="banner_slider__content">
        <span class="banner_slider__code">Solo Channel</span>
        <div class="banner_slider__title">SoloStudyPro</div>
        <div class="banner_slider__text">
          Elevate your study game with SoloStudyPro! Set personalized goals,
          track your progress, and stay motivated with our all-in-one platform
          designed for peer-to-peer learning. Click the start button and start
          learning smarter today!
        </div>
        <a href="#" @click="startButtonHandler" class="banner_slider__button"
          >Start</a
        >
      </div>
    </swiper-slide>
    <swiper-slide class="banner_slider__item">
      <div class="banner_slider__img">
        <img
          src="https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1535759871/jason-leung-798979-unsplash.webp"
          alt=""
        />
      </div>
      <div class="banner_slider__content">
        <span class="banner_slider__code">Solo Channel</span>
        <div class="banner_slider__title">YouTube Learning</div>
        <div class="banner_slider__text">
          Study smarter, not harder with SoloStudyPro's YouTube learning
          feature. Access an extensive library of educational videos and keep
          your focus with our integrated timer and focus mode. Click the start
          button and start learning with YouTube today!
        </div>
        <a href="#" @click="recommendationBtnHandler" class="banner_slider__button"
          >See recommendation</a
        >
      </div>
    </swiper-slide>

    <swiper-slide class="banner_slider__item">
      <div class="banner_slider__img">
        <img
          src="https://res.cloudinary.com/muhammederdem/image/upload/q_60/v1535759871/alessandro-capuzzi-799180-unsplash.webp"
          alt=""
        />
      </div>
      <div class="banner_slider__content">
        <span class="banner_slider__code">Solo Channel</span>
        <div class="banner_slider__title">Focus Mode</div>
        <div class="banner_slider__text">
          Say goodbye to distractions and hello to productivity with
          SoloStudyPro's Focus Mode. Play calming background music, set the
          timer, and eliminate all distractions with just one click. Click the
          start button and start studying in Focus Mode today!
        </div>
        <a href="#" @click="startButtonHandler" class="banner_slider__button"
          >Start</a
        >
      </div>
    </swiper-slide>
    <div class="banner_slider__pagination"></div>
  </swiper>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper";
import { NButton } from "naive-ui";
import "swiper/css";

export default defineComponent({
  name: "SoloChannelBanner",
  setup() {
    return {
      pagination: {
        clickable: true,
        el: ".banner_slider__pagination",
      },
      modules: [Pagination],
    };
  },
  data() {
    return {
      windowWidth: window.innerWidth,
    };
  },
  components: {
    NButton,
    Swiper,
    SwiperSlide,
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },

  methods: {
    startButtonHandler() {
      this.$router.replace("/private-channel");
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    recommendationBtnHandler(){
      this.$router.push("/youtube-recommendation")
    }
  },
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Fira+Sans:400,500,600,700,800");
* {
  box-sizing: border-box;
}

.banner_slider {
  width: 95%;
  position: relative;
  max-width: 80%;
  margin: auto;
  margin-bottom: 24px;
  background: #fff;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  padding: 25px;
  border-radius: 25px;
  height: 400px;
  transition: all 0.3s;

  @media screen and (max-width: 992px) {
    max-width: 720px;
    height: 400px;
  }

  @media screen and (max-width: 768px) {
    min-height: 300px;
    height: auto;
    max-height: 540px;
  }

  @media screen and (max-height: 500px) and (min-width: 992px) {
    height: 350px;
  }

  &__item {
    display: flex;
    align-items: center;

    @media screen and (max-width: 768px) {
      flex-direction: column;
    }

    &.swiper-slide-active {
      .banner_slider__img {
        img {
          opacity: 1;
          transition-delay: 0.3s;
        }
      }
      .banner_slider__content {
        > * {
          opacity: 1;
          transform: none;

          @for $i from 0 to 15 {
            &:nth-child(#{$i + 1}) {
              transition-delay: $i * 0.1 + 0.3s;
            }
          }
        }
      }
    }
  }

  &__img {
    // width: 40%;
    width: 300px;
    flex-shrink: 0;
    height: 300px;
    background-image: linear-gradient(147deg, #fe8a39 0%, #fd3838 74%);
    box-shadow: 4px 13px 30px 1px rgba(252, 56, 56, 0.2);
    border-radius: 20px;
    transform: translateX(-80px);

    overflow: hidden;

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(147deg, #fe8a39 0%, #fd3838 74%);
      border-radius: 20px;
      opacity: 0.8;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      opacity: 0;
      border-radius: 20px;
      transition: all 0.3s;
    }

    @media screen and (max-width: 992px) {
      // width: 45%;
    }
    @media screen and (max-width: 768px) {
      transform: translateY(-50%);
      width: 90%;
    }
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-height: 500px) and (min-width: 992px) {
      height: 270px;
    }
  }

  &__content {
    // width: 60%;
    padding-right: 25px;
    @media screen and (max-width: 992px) {
      // width: 55%;
    }
    @media screen and (max-width: 768px) {
      margin-top: -80px;
      text-align: center;
      padding: 0 30px;
    }

    @media screen and (max-width: 576px) {
      padding: 0;
    }
    > * {
      opacity: 0;
      transform: translateY(25px);
      transition: all 0.4s;
    }
  }

  &__code {
    color: #7b7992;
    margin-bottom: 15px;
    display: block;
    font-weight: 500;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: #0d0925;
    margin-bottom: 20px;
  }

  &__text {
    color: #4e4a67;
    margin-bottom: 30px;
    line-height: 1.5em;
  }

  &__button {
    display: inline-flex;
    background-image: linear-gradient(147deg, #fe8a39 0%, #fd3838 74%);
    padding: 15px 35px;
    border-radius: 50px;
    color: #fff;
    box-shadow: 0px 14px 80px rgba(252, 56, 56, 0.4);
    text-decoration: none;
    font-weight: 500;
    justify-content: center;
    text-align: center;
    letter-spacing: 1px;
    @media screen and (max-width: 576px) {
      width: 100%;
    }
  }
  .swiper-container-horizontal > .swiper-pagination-bullets,
  .swiper-pagination-custom,
  .swiper-pagination-fraction {
    bottom: 10px;
    left: 0;
    width: 100%;
  }
  &__pagination {
    position: absolute;
    z-index: 21;
    right: 20px;
    width: 11px !important;
    text-align: center;
    left: auto !important;
    top: 50%;
    bottom: auto !important;
    transform: translateY(-50%);
    @media screen and (max-width: 768px) {
      transform: translateX(-50%);
      left: 50% !important;
      top: 205px;
      width: 100% !important;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.swiper-pagination-bullets .swiper-pagination-bullet {
      margin: 8px 0;
      @media screen and (max-width: 768px) {
        margin: 0 5px;
      }
    }

    .swiper-pagination-bullet {
      width: 11px;
      height: 11px;
      display: block;
      border-radius: 10px;
      background: #062744;
      opacity: 0.2;
      transition: all 0.3s;
      &-active {
        opacity: 1;
        background: #fd3838;
        height: 30px;
        box-shadow: 0px 0px 20px rgba(252, 56, 56, 0.3);
        @media screen and (max-width: 768px) {
          height: 11px;
          width: 30px;
        }
      }
    }
  }
}
</style>
