<template>
  <div class="main-wrapper">
    <div class="wrapper">
      <div class="chat-section">
        <div class="messages-container">
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
        </div>
      </div>
      <div class="reply-input">
        <input
          v-model="inputText"
          @keyup.enter="submitMessage"
          placeholder="Type your message here..."
          class="reply-input-area"
        />
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
import ChatCollabrateSession from "./ChatCollabrateSession.vue";

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
    ChatCollabrateSession,
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
      chatStore,
    };
  },
  computed: {
    ...mapState(useChatStore, ["hasMoreMessages"]),
  },
});
</script>

<style scoped>
.main-wrapper {
  min-height: 100%;
  width: 100%;

  .wrapper {
    display: flex;
    flex-direction: column;
    padding: 8px;
    height: 100%;

    .chat-section {
      flex-grow: 1;
      margin-bottom: 16px;
      padding-inline: 12px;
      background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.4) 0%,
        rgba(255, 255, 255, 0.4) 100%
      );
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
      border-radius: 18px;
      backdrop-filter: blur(50px);
      overflow: hidden;
      position: relative;

      .messages-container {
        position: absolute;
        height: 100%;
        width: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        background: transparent;
      }
    }

    .reply-input {
      background: #2f2e41;
      border-radius: 12px;
      border: 1px white solid;
      height: 48px;
      width: 100%;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .reply-input-area {
        padding-left: 16px;
        color: white;
        font-weight: 500;
        font-family: "DM Sans";
        outline: none !important;
        background: transparent !important;
        border: none !important;
        width: 100%;

        &::placeholder {
          text-align: left;
        }
      }
    }
  }
}

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
  border-radius: 100px;
  padding: 6px 12px;
  margin-bottom: 16px;
  margin-top: 16px;
  font-size: 12px;
  background: linear-gradient(90deg, #fee3e0 0%, #fce5c9 100%);
  box-shadow: 0px 8px 20px rgba(5, 5, 4, 0.08);
  color: "#2F2E4";
  text-wrap: nowrap;
  font-weight: 500;
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
