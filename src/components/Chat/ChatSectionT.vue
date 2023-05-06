<template>
  <div class="chat">
    <div class="messages-container">
      <InfiniteLoading v-if="hasMoreMessages" @infinite="onInfiniteScroll" />
      <div class="messages">
        <div
          v-for="(group, index) in messagesGroupedByDate"
          :key="index"
          class="message-group"
        >
          <div class="date">
            <span>{{ group.date }}</span>
          </div>
          <div
            v-for="message in group.messages"
            :key="message.id"
            class="message"
          >
            <img :src="message.senderAvatar" alt="avatar" class="avatar" />
            <div class="message-content">
              <div class="text">{{ message.message }}</div>
              <div class="author">{{ message.senderName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="input-area">
      <input type="text" v-model="inputText" @keyup.enter="submitMessage" />
      <button @click="submitMessage">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  computed,
  type PropType,
} from "vue";

import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import { useChatStore } from "../../stores/chat";
import type Channel from "../../types/channels/channel";
import type Message from "../../types/channels/message";
import { mapState } from "pinia";

export default defineComponent({
  components: {
    InfiniteLoading,
  },
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
    messageCollection: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const chatStore = useChatStore();
    const inputText = ref("");

    chatStore.setChannel(props.channel);
    chatStore.fetchMessages(props.messageCollection);

    onMounted(() => {
      chatStore.listenForNewMessages(props.messageCollection);
    });

    onUnmounted(() => {
      chatStore.stopListening();
    });

    function submitMessage() {
      if (inputText.value.trim()) {
        chatStore.sendMessage(props.messageCollection, inputText.value.trim());
        inputText.value = "";
      }
    }

    function onInfiniteScroll() {
      if (!chatStore.hasMoreMessages) {
        return;
      }
      if (chatStore.initialFetch)
        chatStore.fetchMessages(props.messageCollection);
    }

    const messagesGroupedByDate = computed(() => {
      const groupedMessages: { date: string; messages: Message[] }[] = [];

      chatStore.messages.forEach((message) => {
        const date = new Date(message.createdAt).toLocaleDateString();
        const group = groupedMessages.find((g) => g.date === date);

        if (group) {
          group.messages.push(message);
        } else {
          groupedMessages.push({
            date,
            messages: [message],
          });
        }
      });

      // Sort the groupedMessages array in descending order by date
      groupedMessages.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      return groupedMessages;
    });

    return {
      inputText,
      submitMessage,
      onInfiniteScroll,
      messagesGroupedByDate,
    };
  },
  computed: {
    ...mapState(useChatStore, ["hasMoreMessages"]),
  },
});
</script>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column-reverse;
}

.messages {
  display: flex;
  flex-direction: column-reverse;
}

.message-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date {
  background-color: #e0e0e0;
  border-radius: 1rem;
  padding: 0.25rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
}

.message-content {
  background-color: #f0f0f0;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
}

.text {
  margin-bottom: 0.25rem;
}

.author {
  font-size: 0.8rem;
  color: #777;
}

.input-area {
  display: flex;
  padding: 1rem;
}

input {
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  outline: none;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  cursor: pointer;
}
</style>
