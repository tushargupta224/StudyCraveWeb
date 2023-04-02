<template>
  <div class="first-row">
    <div class="left-side-wrapper">
      <div class="first-row-heading">
        Collaborate, Connect,<br />
        Succeed - Studycrave!
      </div>
      <div class="first-row-subheading">
        Transforming the way students learn by fostering collaboration, community, and real-time interaction on a global scale.
      </div>
      <div style="padding-bottom: 16px;"/>
      <n-button type="primary" color="#793BA8">Get Started</n-button>
    </div>

    <div class="photo">
      <img :src="headerIllustration" alt="hero-img" />
    </div>
  </div>
</template>
<script lang="ts">
import headerIllustration from "@/assets/images/Landing Page Illustration.png";
import { NButton } from "naive-ui";

export default {
  data() {
    return {
      headerIllustration: headerIllustration,
    };
  },
  components: {
    NButton,
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

.first-row {
  width: 100%;
  display: table;
  table-layout: fixed;

  &-heading {
    font-size: 3vw;
    font-weight: 700;
    color: $bg-black;
  }
  &-subheading {
    margin-top: 6px;
    font-size: 1.1vw;
    text-align: justify;
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
}
.photo {
  width: 48%;
}
.photo img {
  // margin-left: 4rem;
  max-width: 100%;
  height: auto;
}
</style>
