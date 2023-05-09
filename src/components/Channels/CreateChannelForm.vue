<template>
  <n-card class="n-card">
    <Loading v-if="isCreatingChannel">
      <template v-slot:body>
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </template>
    </Loading>
    <div v-else>
      <div class="form-heading">
        <h3>✨ Create your Channel</h3>
      </div>
      <div class="form-subheading">
        How does you want your channel to look like?
      </div>
      <n-form
        ref="formRef"
        :label-width="80"
        :model="formValue"
        :rules="rules"
        :size="size"
      >
        <n-form-item label="Channel's Name" path="channel.name">
          <n-input v-model:value="formValue.channel.name" />
        </n-form-item>
        <n-form-item label="Topic" path="channel.topic">
          <n-input v-model:value="formValue.channel.topic" />
        </n-form-item>
        <n-form-item label="Description" path="channel.description">
          <n-input
            v-model:value="formValue.channel.description"
            type="textarea"
          />
        </n-form-item>
        <n-form-item
          label="Max. Member Limit"
          :validation-status="inputMaxParticipantStatus"
        >
          <n-input-number
            v-model:value="formValue.channel.maxMembersLimit"
            :min="25"
            :max="500"
          />
          <template #feedback>
            {{ inputMaxParticipantFeedback }}
          </template>
        </n-form-item>
        <n-form-item>
          <n-button @click="handleClick">Create Channel</n-button>
        </n-form-item>
      </n-form>
    </div>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NButton,
  type FormItemRule,
} from "naive-ui";
import type { FormInst } from "naive-ui";
import type Channel from "@/types/channels/channel";
import { useAuthStore } from "@/stores/auth";
import { useChannelStore } from "@/stores/channel";
import Loading from "@/components/Loading.vue";

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null);
    const { user } = useAuthStore();
    const channelStore = useChannelStore();
    return {
      user,
      channelStore,
      formRef,
      size: ref<"small" | "medium" | "large">("medium"),
      formValue: ref({
        channel: <Partial<Channel>>{
          name: "",
          topic: "",
          description: "",
          maxMembersLimit: 100,
        },
      }),
      rules: {
        channel: {
          name: {
            required: true,
            validator(rule: FormItemRule, value: string) {
              if (!value || value.length == 0) {
                return new Error("Channel name is required");
              } else if (value.length < 5) {
                return new Error(
                  "Channel name should be of atleast 5 characters"
                );
              }
              return true;
            },
            trigger: "blur",
          },
          topic: {
            required: true,
            validator(rule: FormItemRule, value: string) {
              if (!value || value.length == 0) {
                return new Error("Topic name is required");
              } else if (value.length < 5) {
                return new Error(
                  "Topic name should be of atleast 5 characters"
                );
              }
              return true;
            },
            trigger: "blur",
          },
          description: {
            required: true,
            message: "Description is required",
            trigger: "blur",
          },
        },
      },
    };
  },
  data() {
    return {
      isCreatingChannel: false,
    };
  },
  computed: {
    inputMaxParticipantStatus() {
      if (!this.formValue.channel.maxMembersLimit) {
        return "error";
      }
    },
    inputMaxParticipantFeedback() {
      if (!this.formValue.channel.maxMembersLimit) {
        return "Setting up of max participants is mandatory";
      }
    },
  },
  methods: {
    handleClick(e: MouseEvent) {
      e.preventDefault();
      this.formRef?.validate((error) => {
        if (!error) {
          this.isCreatingChannel = true;

          const channelToCreate: Partial<Channel> = {
            ...this.formValue.channel,
            ownerId: this.user?.id,
            ownerDisplayName:
              (this.user?.firstName ?? "") + (this.user?.lastName ?? ""),
            ownerAvatar: this.user?.profilePic ?? "",
            ownerStatus: false,
          };

          this.channelStore
            .createChannel(channelToCreate)
            .then((channel) => {
              this.isCreatingChannel = false;
              this.$router.push(`channel/${channel.id}`);
            })
            .catch((error) => {
              this.isCreatingChannel = false;
            });
        }
      });
    },
  },
  components: {
    NCard,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NButton,
    Loading,
  },
});
</script>

<style lang="scss" scoped>
.n-card {
  display: flex;
  flex-direction: column;
  width: 500px;
  border-radius: 25px;
}
.form-heading h3 {
  font-size: 1.8rem;
  margin-top: -4px;
  margin-bottom: 5px;
}
.form-subheading {
  position: relative;
  font-size: 0.8rem;
  font-weight: 400;
  font-style: italic;
  margin-bottom: 12px;
}
.form-container {
  display: flex;
  flex-direction: column;
  & label {
    margin-top: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  & input {
    width: 400px;
    height: 35px;
    border: 1px solid black;
    border-radius: 10px;
    outline: none;
    font-size: 1rem;
    font-weight: 500;
    padding: 0 2%;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.form-btn {
  cursor: pointer;
  position: relative;
  background: #fdd199;
  border: 1px solid #fdd199;
  padding: 2%;
  border-radius: 12px;
  float: right;
  margin-top: 15px;
  right: 8%;
}
.form-btn:hover {
  transform: scale(1.04);
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
}
</style>
