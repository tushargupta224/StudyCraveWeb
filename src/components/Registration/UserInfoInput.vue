<template>
  <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
    <div class="avatar-container">
      <div class="avatar">
        <img
          v-if="formValue.profilePicUrl"
          :src="formValue.profilePicUrl!"
          alt=""
        />
        <img
          v-else
          src="https://upload.wikimedia.org/wikipedia/commons/d/d3/User_Circle.png"
          alt=""
        />
      </div>
      <n-upload
        :limit="1"
        :show-file-list="false"
        :on-success="onUploadSuccess"
        :on-before-upload="beforeUpload"
        :headers="{ 'Content-Type': 'multipart/form-data' }"
      >
        <n-button>{{ uploadButtonTitle }}</n-button>
      </n-upload>
    </div>

    <n-form-item label="First Name" path="firstName" required>
      <n-input v-model:value="formValue.firstName" placeholder="eg. John" />
    </n-form-item>
    <n-form-item label="Last Name" path="lastName" required>
      <n-input v-model:value="formValue.lastName" placeholder="eg. Wick" />
    </n-form-item>
    <n-form-item label="Email" path="email" required>
      <n-input
        v-model:value="formValue.email"
        placeholder="eg. johnwick007@gmail.com"
      />
    </n-form-item>
    <n-form-item label="Interests" path="interests">
      <n-dynamic-tags
        v-model:value="formValue.interests"
        :max="6"
        placeholder="Add a topic"
      />
    </n-form-item>
    <n-button
      @click="handleClick"
      type="primary"
      color="#FDC886"
      text-color="#000"
    >
      Submit
    </n-button>
  </n-form>
</template>

<script lang="ts">
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NDynamicTags,
  NUpload,
  NImage,
  type UploadFileInfo,
} from "naive-ui";
import { defineComponent, nextTick, ref, type PropType } from "vue";
import type { FormInst } from "naive-ui";
import type User from "../../types/user";
import type UpdateUserDetails from "../../types/update_user_details/update_user_details";

export default defineComponent({
  setup(props, { emit }) {
    const formRef = ref<FormInst | null>(null);
    const formValue = ref<UpdateUserDetails>({
      firstName: props.user?.firstName || "",
      lastName: props.user?.lastName || "",
      email: props.user?.email || "",
      profilePic: null,
      profilePicUrl: props.user?.profilePic || null,
      interests: props.user?.interests || [],
    });

    const beforeUpload = (data: {
      file: UploadFileInfo;
      fileList: UploadFileInfo[];
    }) => {
      const url = URL.createObjectURL(data.file.file!);
      formValue.value.profilePic = data.file.file;
      formValue.value.profilePicUrl = url;
    };

    const onUploadSuccess = async (res: any) => {
      // do nothing
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      nextTick(() => {
        formRef.value?.validate((errors) => {
          if (!errors) {
            console.log(formValue.value);
            emit("onUpdate", formValue.value);
          }
        });
      });
    };

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
        email: [
          {
            required: true,
            message: "Please enter your email address",
            trigger: "blur",
          },
          {
            pattern: /^([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+)\.([a-zA-Z]{2,5})$/,
            message: "Please enter a valid email address",
            trigger: "blur",
          },
        ],
      },

      beforeUpload,
      onUploadSuccess,
      handleClick,
    };
  },

  props: {
    user: {
      type: Object as PropType<User | null>,
    },
  },
  computed: {
    uploadButtonTitle(): string {
      return this.formValue.profilePicUrl ? "Change" : "Upload";
    },
  },
  emits: ["onUpdate"],
  components: {
    NButton,
    NForm,
    NFormItem,
    NInput,
    NDynamicTags,
    NUpload,
    NImage,
  },
});
</script>

<style lang="scss" scoped>
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 12px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
