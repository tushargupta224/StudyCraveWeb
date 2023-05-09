<template>
  <div style="padding: 2rem;">
    <nav-bar />
    <div class="first-row">
      <div class="left-side-wrapper">
        <div class="first-row-heading">
          Collaborate, Connect, Succeed - Studycrave!
        </div>
        <div class="avatar-subheading">
          <img
            :src="userAvtarLandingPage"
            alt="user avtar"
            class="avatar-subheading-avatar"
          />

          <div class="first-row-subheading">
            Transforming the way students learn by fostering collaboration,
            community, and real-time interaction on a global scale.
          </div>
        </div>
        <n-button
          type="primary"
          color="#793BA8"
          size="large"
          class="get-started-btn"
          >Get Started</n-button
        >
      </div>

      <div class="photo">
        <img :src="headerIllustration" alt="hero-img" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import NavBar from "../components/NavBar.vue";

import headerIllustration from "@/assets/images/Landing Page Illustration.png";
import userAvtarLandingPage from "@/assets/images/User avatar landing page.png";
import { NButton } from "naive-ui";

export default {
  data() {
    return {
      headerIllustration: headerIllustration,
      userAvtarLandingPage: userAvtarLandingPage,
    };
  },
  components: {
    NButton,
    NavBar,
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

.first-row {
  width: 100%;
  height: 100vh;
  display: table;
  table-layout: fixed;
  height: 90vh;

  &-heading {
    font-size: 3vw;
    font-weight: 700;
    color: $bg-black;
  }
  &-subheading {
    margin-top: 6px;
    font-size: 1.1vw;
    text-align: justify;
    margin-left: 0.4rem;
    max-width: 68%;
  }
}
.avatar-subheading {
  display: flex;
  text-align: center;
  margin-top: 0.5rem;

  &-avatar {
    width: 4vw;
  }
}
.left-side-wrapper {
  width: 54%;
  height: auto;
}
.img-container {
  width: 100%;
  display: table;
  table-layout: fixed;
}
.photo,
.left-side-wrapper {
  display: table-cell;
  vertical-align: middle;
  padding-left: 3vw;
}
.photo {
  width: 48%;
}
.photo img {
  // margin-left: 4rem;
  max-width: 100%;
  height: auto;
}
.get-started-btn {
  margin-top: 1.5rem;
  box-shadow: 0px 0px 19px 1.5px #793ba8;
}

@media screen and (max-width: 477px) {
  .first-row {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;

    &-heading {
      text-align: center;
      font-size: 1.3rem;
    }

    &-subheading {
      font-size: 0.6rem;
      max-width: 100%;
    }
  }
  .photo {
    width: 80vw;
  }
  .left-side-wrapper {
    width: 80vw;
  }
  .avatar-subheading {
    justify-content: center;
  }
  .avatar-subheading-avatar {
    width: 10vw;
  }
  .get-started-btn {
    height: 30px;
    font-size: 10px;
    margin-left: 0.05rem;
    text-align: center;
  }
}
</style>
