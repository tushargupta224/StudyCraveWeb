<template>
  <div class="form-parent">
    <div style="width: 100%;">
      <div class="form-heading">
        <h4>YouTube</h4>
        <close-outline
          style="width: 20px; height: 20px; cursor: pointer"
          @click="closeHandler"
        />
      </div>
      <div class="form-container">
        <form @submit.prevent="submitForm">
          <input
            type="text"
            v-model="videoId"
            required
            placeholder="Paste YouTube video link here..."
          />
          <button
            type="submit"
            style="background-color: transparent; border: none"
          >
            <SearchOutline style="width: 20px; height: 20px; color: white" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CloseOutline, SearchOutline } from "@vicons/ionicons5";

export default {
  setup(props, { emit }) {
    function closeHandler() {
      emit("close");
    }
    return { closeHandler };
  },
  data() {
    return {
      videoId: "",
    };
  },
  methods: {
    submitForm() {
      this.$emit("submit", this.videoId);
      console.log(this.videoId);
    },
  },
  components: {
    CloseOutline,
    SearchOutline,
  },
  emits: ["close"],
};
</script>

<style scoped lang="scss">
.form-parent {
  position: fixed;
  top: 80px;
  right: 24px;
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(252, 252, 252, 0.12);
  border-radius: 18px;
  color: white;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  max-height: 128px;
  padding: 16px;
}

.form-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.form-heading h4 {
  font-size: 20px;
  margin: 0px;
  padding: 0px;
}
.form-container {
  width: 100%;
  margin-top: 16px;
  margin-bottom: 8px;
}

.form-container form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

input {
  border-radius: 50px;
  background-color: #353535;
  border: 1px solid white;
  outline: none;
  color: white;
  padding: 10px 16px;
  width: 100%;
  z-index: 2;
  box-sizing: border-box;
  font-size: 12px;
  font-weight: 600;
  text-align: left;

  &::placeholder {
    color: white;
    text-align: left;
    font-weight: 400;
    font-size: 12px;
  }
}

.form-container button {
  cursor: pointer;
}

@media all and (max-width: 601px) {
  .form-parent {
    top: 25%;
    left: 25%;
    z-index: 1;
    width: 270px;
  }
  .form-heading h4 {
    font-size: 1rem;
  }
  .form-heading p {
    font-size: 0.5rem;
    margin-bottom: 20px;
  }
  .form-container button {
    padding: 2px 10px;
    font-size: 0.8rem;
  }
}
</style>
