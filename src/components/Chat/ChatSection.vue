<template>
  <div class="chat">
    <n-layout class="chat-layout">
      <n-layout-content class="messages-container">
        <div class="infinite">
          <InfiniteLoading
            v-if="hasMoreMessages"
            @infinite="onInfiniteScroll"
          />
        </div>
        <div
          class="empty_state"
          v-if="messagesGroupedByDate.length === 0 && !hasMoreMessages"
        >
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/social-messages-2511593-2122857.png?f=webp"
            alt=""
          />
          <h1>No chat to show.</h1>
          <p>Start a conversation from your end.</p>
        </div>
        <div v-else class="messages">
          <div
            v-for="(group, index) in messagesGroupedByDate"
            :key="index"
            class="message-group"
          >
            <div class="date-container">
              <div class="date">
                <span>{{ group.date }}</span>
              </div>
            </div>
            <ChatMessage
              v-for="message in group.messages"
              :message="message"
              :key="message.id"
            />
          </div>
        </div>
      </n-layout-content>
    </n-layout>
    <div class="input-area">
      <div class="input-container">
        <n-input
          v-model:value="inputText"
          @keyup.enter="submitMessage"
          placeholder="Type message"
          class="input-field"
        />
        <n-button class="btn-grad" type="primary" @click="submitMessage"
          >Send</n-button
        >
      </div>
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
import ChatMessage from "@/components/Chat/ChatMessage.vue";
import { mapState } from "pinia";
import {
  NLayout,
  NLayoutContent,
  NLayoutFooter,
  NInput,
  NButton,
  NTag,
  NSpace,
} from "naive-ui";

export default defineComponent({
  components: {
    InfiniteLoading,
    ChatMessage,
    NLayout,
    NLayoutContent,
    NLayoutFooter,
    NInput,
    NButton,
    NTag,
    NSpace,
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
        const date = new Date(message.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
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
        return dateA.getTime() - dateB.getTime();
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
  height: 90%;
  min-height: 90vh;
  width: 100%;
  background-color: #fcfcfe;
  background-image: url("https://img.freepik.com/free-vector/white-abstract-background-design_361591-1242.jpg?w=2000");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

.chat-layout {
  height: 100%;
  background: transparent;
}

.empty_state {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: auto;
}
.empty_state h1 {
  font-size: 3rem;
  margin: 0;
}
.empty_state p {
  font-style: italic;
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
}

.date-container {
  display: flex;
  justify-content: center;
}
.date {
  text-align: center;
  width: 90px;
  border-radius: 1rem;
  padding: 0.25rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  background: #1f4037; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #99f2c8,
    #1f4037
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #99f2c8,
    #1f4037
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  border: 1px solid #1f4037;
  color: white;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 40px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.input-area {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0.5rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.input-container {
  display: flex;
  align-items: center;
  width: calc(100% - 4rem);
  margin: 0 auto;
}

.input-field {
  flex-grow: 1;
  margin-right: 1rem;
  border-radius: 24px;
  padding: 0.28rem;
}

.btn-grad {
  background-image: linear-gradient(
    to right,
    #ee0979 0%,
    #ff6a00 51%,
    #ee0979 100%
  );
  padding: 5px 25px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 32px;
  font-weight: 700;
  display: block;
}

.btn-grad:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
}
</style>
