<template>
  <div class="heading-conatiner">
    <h2>{{ title }}</h2>
    <p>{{ subTitle }}</p>
  </div>
  <n-form ref="formRef" :model="formValue" :rules="rules">
    <n-form-item
      label="Registered mobile number"
      path="phone"
      style="
        border-top: none;
        border-left: none;
        border-right: none;
        outline: none;
      "
    >
      <n-input
        v-model:value="formValue.phone"
        placeholder="00000-00000"
        maxlength="10"
        @input="checkNumber"
      />
    </n-form-item>
    <n-button
      id="otp-send-button"
      @click="onSubmit"
      :ghost="isButtonDisabled ? true : false"
      :color="isButtonDisabled ? undefined : '#FDC886'"
      :text-color="isButtonDisabled ? '#bab8ba' : '#000'"
      style="margin-bottom: 2rem"
      :disabled="isButtonDisabled"
    >
    Continue
    </n-button>
    <Loading v-if="isLoading">
      <template v-slot:body>
        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </template>
    
    
    </Loading>
  </n-form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useMessage } from "naive-ui";
import type { FormInst } from "naive-ui";
import { NForm, NFormItem, NInput, NButton } from "naive-ui";
import Loading from '@/components/Loading.vue'

export default defineComponent({
  setup(props) {
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const formValue = ref({
      phone: props.phoneNumber || "",
    });

    return {
      formRef,
      formValue: formValue,
      rules: {
        phone: {
          required: true,
          trigger: ["input"],
        },
      },
    };
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  components: {
    NForm,
    NFormItem,
    NInput,
    NButton,
    Loading,
  },
  computed: {
    isButtonDisabled(): boolean {
      return this.formValue.phone.length < 10;
    },
  },
  emits: ["onSubmit"],
  methods: {
    onSubmit() {
      this.$emit("onSubmit", this.formValue.phone);
      this.isLoading = !false;
      setTimeout(() => {
        this.isLoading = !true;
      }, 5000);
    },
    checkNumber() {
      this.formValue.phone = this.formValue.phone.replace(/[^0-9]/g, "");
    },
  },
});
</script>
<style lang="scss" scoped>
.heading-conatiner p {
  font-style: italic;
  font-size: 0.8rem;
  margin-top: -30px;
}


.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #4A2271;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

</style>
