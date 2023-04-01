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
    <div class="img-container">
      <img :src='headerIllustration' alt="hero-img">

    </div>
  </div>
</template>
<script lang="ts">
import headerIllustration from '@/assets/images/Landing Page Illustration.png';

export default ({
  data(){
    return{
      headerIllustration:headerIllustration,
    }
  }
})
</script>

<style lang="scss" scoped>
@import "../assets/scss/variables.scss";

.hero-section {
  height: 100vh;
  display: flex;

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
.img-container{
  max-width: 80%;
}
.img-container img{
  
  width:40rem;
  height: 40rem;
}

@media screen and (max-width: 920px){
  .hero-section{
    // flex-direction: column-reverse;
    margin-top: 30px;
    &-heading{
      font-size: 1.8rem;
    }
  }
  .right-side-wrapper{
    margin-top: 2rem;
  }
  
  .img-container img{
    width: 30rem;
    height: 30rem;
  }
}

@media screen and (max-width:660px){
  .img-container img{
    width: 25rem;
    height: 25rem;
  }
}
@media screen and (max-width: 468px){
  .hero-section{
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;

    &-heading{
      font-size: 2rem;
    }
  }
  .right-side-wrapper{
    margin-top: -0.7rem;
  }
  .img-container img{
    max-width: 100%;
    max-height: 80%;
    width: 21rem;
    height: 21rem;
  }

}
</style>
