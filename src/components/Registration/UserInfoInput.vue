<template>
  <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
    <n-form-item label="First Name" path="firstName">
      <n-input
        v-model:value="formValue.firstName"
        placeholder="Input firstname"
      />
    </n-form-item>
    <n-form-item label="Last Name" path="lastName">
      <n-input
        v-model:value="formValue.lastName"
        placeholder="Input lastname"
      />
    </n-form-item>
    <n-form-item label="email" path="email">
      <n-input v-model:value="formValue.email" placeholder="Input email" />
    </n-form-item>
    <n-button @click="handleClick" type="primary"> Submit </n-button>
  </n-form>
</template>

<script lang="ts">
import { NButton, NForm, NFormItem, NInput } from "naive-ui";
import { defineComponent, ref, type PropType } from "vue";
import type { FormInst } from "naive-ui";
import type User from "../../types/user";
import type SignUpDetails from "../../types/signup/signup_details";

export default defineComponent({
  setup(props, { emit }) {
    const formRef = ref<FormInst | null>(null);
    const formValue = ref<SignUpDetails>({
      firstName: props.user?.firstName || "",
      lastName: props.user?.lastName || "",
      email: props.user?.email || "",
      profilePic: props.user?.profilePic || "",
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
      },
      handleClick(e: MouseEvent) {
        e.preventDefault();
        formRef.value?.validate((errors) => {
          if (!errors) {
            emit("onSignUp", formValue.value);
          }
        });
      },
    };
  },
  props: {
    user: {
      type: Object as PropType<User | null>,
    },
  },
  emits: ["onSignUp"],
  components: {
    NButton,
    NForm,
    NFormItem,
    NInput,
  },
});
</script>
