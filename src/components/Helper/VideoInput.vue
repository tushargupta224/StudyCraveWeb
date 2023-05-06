<template>
  <div class="form-parent">
    <div class="form-heading">
      <h4>Enter YouTube video Link.</h4>
      <p>Provide the youtube video link to enjoy study session with songs.</p>
    </div>
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <input type="text" v-model="videoId" required  placeholder="Enter link here."/>
        <button type="submit">Search</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      videoId: "",
    };
  },
  methods: {
    submitForm() {
      this.$emit("submit", this.videoId);
      console.log(this.videoId)
    },
  },
};
</script>

<style scoped lang="scss">
.form-parent {
  position: fixed;
  top: 12%;
  right: 5%;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(17, 25, 40, 0.75);
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.125);
  color: white;
  padding-left: 20px;
  z-index: 2;
}
.form-heading h4{
    font-size: 1.4rem;
    margin-bottom: 5px;
    margin-right: 10px;
}
.form-heading p{
    font-style: italic;
    font-size: 0.6rem;
    margin-top: 0px;
    max-width: 250px;
}
.form-container{
    display: flex;
}
input {
  height: 25px;
  border-radius: 8px;
  background-color: transparent;
  border: 2px solid white;
  outline: none;
  color: white;
  padding-left: 4%;
  z-index: 2;
}
.form-container button{
    margin-top: 10px;
    font-size: 1.2rem;
    border: 2px solid white;
    border-radius: 12px;
    background-color: rgb(248, 214, 79);
    padding: 5px 15px;
    margin-bottom: 20px;
    cursor: pointer;
}

@media all and (max-width: 601px){
  .form-parent{
    top: 25%;
    left: 25%;
    z-index: 1;
  }
  .form-heading h4{
    font-size: 1rem;
  }
  .form-heading p{
    font-size: 0.5rem;
    margin-bottom: 20px;
  }
  .form-container button{
    padding: 2px 10px;
    font-size: 0.8rem;
  }
}
</style>
