import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  QuerySnapshot,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import type Message from "../types/channels/message";
import { db } from "../config/firebase";

interface MessageState {
  messages: Message[];
  groupedMessages: { [key: string]: Message[] };
  isLoading: boolean;
  error: string | null;
  listener: Unsubscribe | null;
}

export const useMessageStore = defineStore({
  id: "message",
  state: (): MessageState => ({
    messages: [],
    groupedMessages: {},
    isLoading: false,
    error: null,
    listener: null,
  }),
  actions: {
    async fetchMessages(channelId: string): Promise<void> {
      this.isLoading = true;
      try {
        const messagesRefQuery = query(
          collection(db, "channels", channelId, "messages")
        );
        const querySnapshot = await getDocs(messagesRefQuery);

        this.updateAndGroupMessages(querySnapshot);

        this.isLoading = false;
      } catch (error) {
        this.error = (error as any).message;
        this.isLoading = false;
      }
    },

    listenForMessages(channelId: string): void {
      if (this.listener !== null) {
        return;
      }

      const messagesRefQuery = query(
        collection(db, "channels", channelId, "messages")
      );

      this.listener = onSnapshot(messagesRefQuery, (querySnapshot) => {
        this.updateAndGroupMessages(querySnapshot);
      });
    },
    updateAndGroupMessages(querySnapshot: QuerySnapshot<DocumentData>) {
      const messages: Message[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const message: Message = {
          id: doc.id,
          ...doc.data(),
        } as Message;
        messages.push(message);
      });

      this.groupMessagesByDate(messages);
    },

    stopListeningForMessages(): void {
      if (this.listener !== null) {
        this.listener();
        this.listener = null;
      }
    },

    groupMessagesByDate(messages: Message[]): void {
      const groupedMessages: { [key: string]: Message[] } = {};
      messages.forEach((message) => {
        const dateKey = new Date(message.createdAt).toDateString();
        if (!groupedMessages[dateKey]) {
          groupedMessages[dateKey] = [];
        }
        groupedMessages[dateKey].push(message);
      });
      this.groupedMessages = groupedMessages;
      this.messages = messages;
    },

    // ...
  },
});
