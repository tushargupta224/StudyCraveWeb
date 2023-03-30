<template>
  <div>
    <h2>{{ title }}</h2>
  </div>
  <n-form ref="formRef" :model="formValue" :rules="rules">
    <n-form-item
      label="Registered mobile number"
      path="phone"
      style="border-top: none; border-left: none; border-right: none"
    >
      <n-input
        v-model:value="formValue.phone"
        placeholder="00000-00000"
        maxlength="10"
        @input="checkNumber"
      />
    </n-form-item>
    <n-button
      @click="onSubmit"
      :ghost="isButtonDisabled ? true : false"
      :color="isButtonDisabled ? undefined : '#00FF00'"
      text-color="#0f0f0f"
      style="margin-bottom: 2rem"
      :disabled="isButtonDisabled"
      >Continue</n-button
    >
  </n-form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useMessage } from "naive-ui";
import type { FormInst } from "naive-ui";
import { NForm, NFormItem, NInput, NButton } from "naive-ui";

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
    phoneNumber: {
      type: String,
    },
  },
  components: {
    NForm,
    NFormItem,
    NInput,
    NButton,
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
    },
    checkNumber() {
      this.formValue.phone = this.formValue.phone.replace(/[^0-9]/g, "");
    },
  },
});
</script>
