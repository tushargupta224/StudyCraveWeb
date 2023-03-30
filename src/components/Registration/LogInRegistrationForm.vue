<template>
  <n-card
    style="width: 600px"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
    class="modal"
  >
    <n-message-provider>
      <XyzTransition appear mode="out-in">
        <div xyz="fade right-80%" v-if="showPhoneInput">
          <PhoneNumberInput @onSubmit="showPhoneInput = false" />
        </div>

        <div xyz="fade left-80%" v-if="!showPhoneInput">
          <OtpInput @onOtpSubmit="onSubmitOtp" />
        </div>
      </XyzTransition>
    </n-message-provider>
  </n-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NCard, NMessageProvider } from "naive-ui";
import { XyzTransition } from "@animxyz/vue3";
import PhoneNumberInput from "@/components/Registration/PhoneNumberInput.vue";
import OtpInput from "@/components/Registration/OtpInput.vue";
import { useAuthStore } from "../../stores/auth";

export default defineComponent({
  setup() {
    const authStore = useAuthStore();

    return { authStore };
  },
  data() {
    return {
      showModal: false,
      showPhoneInput: true,
    };
  },
  components: {
    NCard,
    NMessageProvider,
    XyzTransition,
    PhoneNumberInput,
    OtpInput,
  },
  methods: {
    onSubmitOtp() {
      //
    },
  },
});
</script>

<style lang="scss">

@media screen and (max-width: 1440px){

  .modal{
    width: 600px;
  }

}

@media screen and (max-width: 598px){
  .modal{
    width: 500px !important;
  }
}
@media screen and (max-width: 500px){
  .modal{
    width: 350px !important;
  }
}
@media screen and (max-width: 350px){
  .modal{
    width: 300px !important;
  }
}


</style>