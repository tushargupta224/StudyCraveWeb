<template>
  <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
    <n-form-item label="First Name">
      <n-input v-model:value="formValue.firstName" placeholder="Input firstname" />
    </n-form-item>
    <n-form-item label="Last Name">
      <n-input v-model:value="formValue.lastName" placeholder="Input lastname" />
    </n-form-item>
    <n-form-item label="email">
      <n-input v-model:value="formValue.email" placeholder="Input email" />
    </n-form-item>
    <n-form-item label="Phone Number">
      <n-input
        v-model:value="formValue.phoneNumber"
        placeholder="Phone Number"
      />
    </n-form-item>
    <n-button @click="handleClick" type="primary"> SUBMIT </n-button>
  </n-form>
</template>

<script lang="ts">
import { NButton, NForm, NFormItem, NInput } from "naive-ui";
import { defineComponent, ref } from "vue";
import type { FormInst } from "naive-ui";
import type User from "../../types/user";

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null);
    const formValue = ref<User>({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      profilePic: "",
      phoneCountryCode: "",
      phoneNumber: "",
    });

    return {
      formRef,
      formValue: formValue,
      rules: {
        firstName: {
          required: true,
          message: "Please enter your first name",
          trigger: "blur",
        },
        lastName: {
          required: true,
          message: "Please enter your last name",
          trigger: "blur",
        },
        email: {
          required: true,
          message: "Please enter your email",
          trigger: "blur",
        },
        phoneNumber: {
          required: true,
          trigger: ["input"],
        },
      },
      handleClick(e: MouseEvent) {
        e.preventDefault();
        formRef.value?.validate((errors) => {
          if (!errors) {
            console.log(JSON.stringify(formValue.value, null, 2));
          } else {
            console.log(errors);
          }
        });
      },
    };
  },
  components: {
    NButton,
    NForm,
    NFormItem,
    NInput,
  },
});
</script>
