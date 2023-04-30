<template>
  <div class="card" :key="channel.id">
    <h2 class="card-title">{{ channel.topic }}</h2>
    <h3 class="card-description">{{ channel.description }}</h3>
    <p class="card-created-by">created by {{ channel.ownerDisplayName }}</p>
    <button class="join-enter-button" @click="onJoinOrEnter">
      {{ buttonTitle }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { useAuthStore } from "../../stores/auth";
import type Channel from "../../types/channels/channel";

export default defineComponent({
  name: "ChannelCard",
  setup() {
    const authStore = useAuthStore();

    return {
      userId: authStore.uid,
    };
  },
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },

  computed: {
    isJoined(): boolean {
      return this.channel.memberIds.includes(this.userId!);
    },
    buttonTitle(): string {
      if (
        this.channel.memberIds.includes(this.userId!) ||
        this.channel.ownerId === this.userId
      ) {
        return "Enter";
      } else {
        return "Join Now";
      }
    },
  },
  methods: {
    onJoinOrEnter() {
      this.$router.push(`/channel/${this.channel.id}`);
    },
  },
});
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  background-color: #fff;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: scale(1.05);
}

.card-title {
  font-size: 28px;
  margin: 20px 0 10px 0;
  font-weight: 600;
  color: #333;
}

.card-description {
  font-size: 18px;
  margin: 10px 0 20px 0;
  color: #555;
}

.card-created-by {
  font-size: 14px;
  margin: 0 0 10px 0;
  color: #888;
}

.join-enter-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 30px;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  transition: background-color 0.2s ease-in-out;
}

.join-enter-button:hover {
  background-color: #0062cc;
}
</style>
