// chatStore.ts
import {
  query,
  collection,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  onSnapshot,
  where,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { db } from "../config/firebase";
import type Channel from "../types/channels/channel";
import type Message from "../types/channels/message";
import { useAuthStore } from "./auth";
import type { ISessionParticipants } from "../types/channels/ISessionParticipants";

export const useChatStore = defineStore({
  id: "chat",
  state: () => ({
    channel: null as Channel | null,
    messages: [] as Message[],
    lastMessage: null as Message | null,
    hasMoreMessages: true,
    initialFetch: false,
    listener: null as Function | null,
    videoCallListener: null as Function | null,
    participants: [] as ISessionParticipants[],
    onVideoSession: false,
  }),
  actions: {
    setChannel(channel: Channel) {
      this.channel = channel;
      this.messages = [];
      this.lastMessage = null;
      this.initialFetch = false;
      this.hasMoreMessages = true;
      this.participants = [];

      this.listenForVideoCallParticipants();
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

      this.stopListeningForVideoCallParticipants();
    },
    async joinVideoCall(
      mediaStreamId: string,
      audioEnabled: boolean,
      videoEnabled: boolean
    ) {
      if (!this.channel) return;

      const { user } = useAuthStore();
      if (!user) return;

      const streamParticipant: ISessionParticipants = {
        userId: user.id,
        userName: (user.firstName ?? "") + " " + (user.lastName ?? ""),
        userAvatar: user.profilePic ?? "",
        mediaStreamId: mediaStreamId,
        audioEnabled: audioEnabled,
        videoEnabled: videoEnabled,
      };
      this.participants = [...this.participants, streamParticipant];

      await addDoc(
        collection(db, `channels/${this.channel.id}/callParticipants`),
        streamParticipant
      );
    },

    async updateParticipantConfigStatus(updated: ISessionParticipants) {
      await updateDoc(
        doc(db, `channels/${this.channel!.id}/callParticipants/${updated.id}`),
        { ...updated }
      );
    },

    async leaveVideoCall() {
      if (!this.channel) return;

      const { user } = useAuthStore();
      if (!user) return;

      const participantRef = collection(
        db,
        `channels/${this.channel.id}/callParticipants`
      );

      const querySnapshot = await getDocs(
        query(participantRef, where("userId", "==", user.id))
      );

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    },

    listenForVideoCallParticipants() {
      if (!this.channel) return;

      const participantsQuery = query(
        collection(db, `channels/${this.channel.id}/callParticipants`)
      );

      this.videoCallListener = onSnapshot(participantsQuery, (snapshot) => {
        this.participants = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id } as ISessionParticipants;
        });

        console.log("Video call participants:", this.participants);
      });
    },

    stopListeningForVideoCallParticipants() {
      if (this.videoCallListener) {
        this.videoCallListener();
        this.videoCallListener = null;
      }
    },
  },
});
