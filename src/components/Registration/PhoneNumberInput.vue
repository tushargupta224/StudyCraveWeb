<template>
  <div>
    <h1>Log in</h1>
  </div>
  <div>
    <h3>Create your account.</h3>
  </div>
  <n-form ref="formRef" :model="formValue" :rules="rules">
    <n-form-item
      label="Registered mobile number"
      path="phone"
      style="border-top: none; border-left: none; border-right: none"
    >
      <n-input v-model:value="formValue.phone" placeholder="00000-00000" maxlength='10'/>
    </n-form-item>
    <n-button
      @click="handleValidateCheck"
      ghost
      color="#00FF00"
      text-color="#0f0f0f"
      style="margin-bottom: 2rem"
      :disabled="isButtonDisabled"
      
      >CONTINUE</n-button
    >
  </n-form>
  <!-- <pre>{{ JSON.stringify(formValue, null, 2) }}</pre> -->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useMessage } from "naive-ui";
import type { FormInst } from "naive-ui";
import { NForm, NFormItem, NInput, NButton } from "naive-ui";

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const formValue = ref({
      phone: "",
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
      handleValidateCheck(e: MouseEvent) {
        e.preventDefault();
        formRef.value?.validate((errors) => {
          if (!errors) {
            message.success("Valid");
          } else {
            console.log(errors);
            message.error("Invalid");
          }
          console.log(formValue.value.phone);
        });
      },
    };
  },
  components: {
    NForm,
    NFormItem,
    NInput,
    NButton,
  },
  computed:{
    isButtonDisabled():boolean{
      return this.formValue.phone.length <=10 ;
    },
  },
  methods:{
    // ismorethan10(e:KeyboardEvent){
    //   if(this.formValue.phone.length >9){
    //     e.preventDefault();
    //   }
    // }
  }
});
</script>
