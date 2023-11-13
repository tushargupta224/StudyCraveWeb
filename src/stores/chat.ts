// chatStore.ts
import {
  query,
  collection,
  orderBy,
  limit,
  startAfter,
  getDocs,
  serverTimestamp,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { db } from "../config/firebase";
import type Channel from "../types/channels/channel";
import type Message from "../types/channels/message";
import { useAuthStore } from "./auth";
import type Quiz from "../types/channels/quiz/quiz";
import { MessageTypeEnum } from "../enum/message.enum";

export const useChatStore = defineStore({
  id: "chat",
  state: () => ({
    channel: null as Channel | null,
    messages: [] as Message[],
    lastMessage: null as Message | null,
    hasMoreMessages: true,
    initialFetch: false,
    listener: null as Function | null,
  }),
  actions: {
    setChannel(channel: Channel) {
      this.channel = channel;
      this.messages = [];
      this.lastMessage = null;
      this.initialFetch = false;
      this.hasMoreMessages = true;
    },
    async fetchMessages(messageCollection: string, limitPerPage: number = 20) {
      if (!this.channel || !this.hasMoreMessages) return;

      let messagesQuery = query(
        collection(db, `channels/${this.channel.id}/${messageCollection}`),
        orderBy("createdAt", "desc"),
        limit(limitPerPage)
      );

      if (this.lastMessage) {
        messagesQuery = query(
          collection(db, `channels/${this.channel.id}/${messageCollection}`),
          orderBy("createdAt", "desc"),
          startAfter(this.lastMessage.createdAt),
          limit(limitPerPage)
        );
      }

      const snapshot = await getDocs(messagesQuery);
      if (snapshot.docs.length < limitPerPage) {
        this.hasMoreMessages = false;
      }

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const message: Message = {
          id: doc.id,
          ...data,
        } as Message;
        this.messages.unshift(message);
        this.lastMessage = message;
      });

      if (!this.initialFetch) this.initialFetch = true;
    },
    async sendMessage(messageCollection: string, message: string) {
      if (!this.channel) return;

      const { user } = useAuthStore();
      if (!user) return;

      const newMessage: Partial<Message> = {
        message: message,
        senderId: user.id,
        senderAvatar: user.profilePic ?? "",
        senderName: (user.firstName ?? "") + " " + (user.lastName ?? ""),
        createdAt: new Date().toISOString(),
        type: MessageTypeEnum.MESSAGE,
      };

      await addDoc(
        collection(db, `channels/${this.channel.id}/${messageCollection}`),
        newMessage
      );
    },
    async createQuiz(messageCollection: string, quiz: Quiz) {
      if (!this.channel) return;

      const { user } = useAuthStore();
      if (!user) return;

      const newMessage: Partial<Message> = {
        message: "",
        senderId: user.id,
        senderAvatar: user.profilePic ?? "",
        senderName: (user.firstName ?? "") + " " + (user.lastName ?? ""),
        createdAt: new Date().toISOString(),
        quiz: quiz,
        type: MessageTypeEnum.QUIZ,
      };

      await addDoc(
        collection(db, `channels/${this.channel.id}/${messageCollection}`),
        newMessage
      );
    },
    listenForNewMessages(messageCollection: string) {
      if (!this.channel) return;
      // chatStore.ts (continued)
      const messagesQuery = query(
        collection(db, `channels/${this.channel.id}/${messageCollection}`),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      this.listener = onSnapshot(messagesQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            const data = change.doc.data();
            const message: Message = {
              id: change.doc.id,
              ...data,
            } as Message;

            // Check if the message already exists in the messages array
            const messageExists = this.messages.some(
              (existingMessage) => existingMessage.id === message.id
            );

            // Skip adding the message if it already exists
            if (messageExists) {
              return;
            }

            this.messages.push(message);
          }
        });
      });
    },
    stopListening() {
      if (this.listener) {
        this.listener();
        this.listener = null;
      }
    },
  },
});
