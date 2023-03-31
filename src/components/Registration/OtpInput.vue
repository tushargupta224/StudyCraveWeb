<template>
  <h2>Verification</h2>
  <div>
    <text class="subtitle-text">
      Please enter the OTP sent to
      <text class="highlight-phone-number">+91 {{ phoneNumber }}</text>
      &nbsp;
      <n-button
        text
        style="edit-phone-number"
        @click="$emit('onEditPhoneNumber')"
      >
        <text class="edit-phone-number"
          >Edit<n-icon> <Edit20Regular /> </n-icon
        ></text>
      </n-button>
    </text>
  </div>
  <div class="flex otp-container">
    <v-otp-input
      ref="otpInput"
      input-classes="otp-input"
      separator="-"
      :num-inputs="6"
      :should-auto-focus="true"
      :is-input-num="true"
      :conditionalClass="['one', 'two', 'three', 'four']"
      @on-change="handleOnChange"
      @on-complete="handleOnComplete"
    />
  </div>
  <div class="button-container">
    <n-button
      @click="onSubmit"
      :ghost="isOtpEntered ? true : false"
      :color="isOtpEntered ? undefined : '#00FF00'"
      :disabled="isOtpEntered"
      >Continue</n-button
    >
  </div>
</template>
<script lang="ts">
// Import in a Vue component
import VOtpInput from "vue3-otp-input";
import { defineComponent, ref } from "vue";
import { NButton, NIcon } from "naive-ui";
import { Edit20Regular } from "@vicons/fluent";

export default defineComponent({
  name: "App",
  components: {
    VOtpInput,
    NButton,
    Edit20Regular,
    NIcon,
  },
  setup() {
    const otpInput = ref<any | null>(null);

    return { otpInput };
  },
  props: {
    phoneNumber: {
      type: String,
    },
  },

  data() {
    return {
      otp: "",
      otpEntered: false,
    };
  },
  computed: {
    isOtpEntered(): boolean {
      return this.otp.length < 6;
    },
  },
  emits: ["onOtpSubmit", "onEditPhoneNumber"],
  methods: {
    onSubmit() {
      if (this.otpEntered) {
        this.$emit("onOtpSubmit", this.otp);
      }
    },
    handleOnChange(value: string) {
      this.otp = value;
    },
    handleOnComplete() {
      this.otpEntered = true;
    },
  },
  watch: {
    otp(value) {
      if (value.length < 6) {
        this.otpEntered = false;
      }
    },
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";
.otp-container {
  justify-content: center;
}
.otp-input {
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  background-color: $bg-white;
}
/* Background colour of an input field with value */
.otp-input.is-complete {
  background-color: $bg-white;
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}



@media screen and (max-width: 600px) {
  .otp-input {
    width: 32px;
    height: 32px;
    margin: 0 1.5px;
  }
}
@media screen and (max-width: 350px){
  .otp-input{
    width: 24px;
    height: 24px;
    margin: 0 1px;
  }
}
.subtitle-text {
  font-size: 16px;
}

.highlight-phone-number {
  text-decoration: underline;
  text-decoration-color: $green-blue;
  font-weight: 700;
  color: $green-blue;
}

.edit-phone-number {
  text-decoration: underline;
  text-decoration-color: $green-blue;
  font-weight: 700;
  color: #000;
}
</style>
