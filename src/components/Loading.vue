<template>
    <Transition name="loading-fade">
  <div class="loading-backdrop">
    <div class="loading">
      <div class="loading-body">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</Transition>
</template>

<script lang="ts">
export default {
  name: "Loading",
};
</script>

<style lang="scss">
.loading-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  z-index: 99;
  height: 333px;
  width: 600px;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
}

.loading-body {
  position: relative;
  padding: 20px 10px;
  z-index: 22;
}

.loading-fade-enter,
  .loading-fade-leave-to {
    opacity: 0;
  }

  .loading-fade-enter-active,
  .loading-fade-leave-active {
    transition: opacity .5s ease;
  }

  
@media screen and (max-width: 1440px) {
  .loading {
    width: 600px;
  }
}

@media screen and (max-width: 598px) {
  .loading {
    width: 500px !important;
  }
}
@media screen and (max-width: 500px) {
  .loading {
    width: 350px !important;
  }
}
@media screen and (max-width: 350px) {
  .loading {
    width: 300px !important;
  }
}

</style>
