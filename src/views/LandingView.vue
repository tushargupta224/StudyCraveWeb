<template>
  <div class="hero-section">
    <div class="max-width right-side-wrapper">
      <div class="hero-section-heading">
        Collaborate. Connect. Succeed. - Studycrave!
      </div>
      <!-- <div class="hero-section-subheading">
        Join a community of learners, achieve more.
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

.hero-section {
  height: 100vh;

  &-heading {
    max-width: 650px;
    font-size: 3rem;
    font-weight: 700;
    color: $bg-black;
  }
  &-subheading {
    margin-top: 20px;
    font-size: 3rem;
    font-weight: 700;
    line-height: 3rem;
    color: $dark-yellow;
  }
  &-background {
    position: absolute;
    right: 0px;
    top: 0px;
    height: 790px;
    width: 728px;
    z-index: -1;
  }
}
.right-side-wrapper {
  margin-top: 100px;
}
</style>
