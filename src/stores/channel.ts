import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  QuerySnapshot,
  runTransaction,
  setDoc,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { db } from "../config/firebase";
import type Channel from "../types/channels/channel";
import type ChannelMembers from "../types/channels/channel_member";
import type User from "../types/user";
import { useAuthStore } from "./auth";

export const useChannelStore = defineStore({
  id: "channels",
  state: () => ({
    channels: [] as Channel[],
    myChannels: [] as Channel[],
    joinedChannels: [] as Channel[],
    exploreChannels: [] as Channel[],
    channelsFetched: false,
  }),
  getters: {},
  actions: {
    async createChannel(channel: Channel) {
      const channelColRef = collection(db, "channels");

      const channelData: Partial<Channel> = {
        name: channel.name,
        topic: channel.topic,
        description: channel.description,
        memberIds: [],
        createdAt: channel.createdAt,
        maxMembersLimit: channel.maxMembersLimit,
        ownerId: channel.ownerId,
        ownerDisplayName: channel.ownerDisplayName,
        ownerAvatar: channel.ownerAvatar,
        ownerStatus: channel.ownerStatus,
      };

      await addDoc(channelColRef, channelData)
        .then(() => {
          console.log("added successfully");
        })
        .catch((error) => {
          console.log("errr while adding");
          console.log(error);
        });
    },
    async loadChannelByChannelId(channelId: string): Promise<Channel> {
      const channelRef = doc(db, "channels", channelId);
      const channelRes = await getDoc(channelRef);

      if (!channelRes.exists()) {
        throw new Error("Channel does not exist.");
      }

      const channel = { id: channelRes.id, ...channelRes.data() } as Channel;

      const members = await this.loadChannelMembers(channelId);

      channel.members = members;

      return channel;
    },
    async loadChannels(userId: string) {
      const channelsRefQuery = query(collection(db, "channels"));
      const querySnapshot = await getDocs(channelsRefQuery);

      this.updateChannelList(userId, querySnapshot).then(() => {
        this.channelsFetched = true;
      });

      onSnapshot(channelsRefQuery, (querySnapshot) => {
        this.updateChannelList(userId, querySnapshot);
      });
    },
    async loadChannelMembers(channelId: string) {
      const channelMembersRef = collection(
        db,
        "channels",
        channelId,
        "members"
      );
      const membersRefQuery = query(channelMembersRef);
      const querySnapshot = await getDocs(membersRefQuery);

      const members: ChannelMembers[] = [];

      querySnapshot.forEach((doc) => {
        const member = doc.data() as ChannelMembers;
        member.id = doc.id;
        members.push(member);
      });

      return members;
    },
    async updateChannelList(
      userId: string,
      querySnapshot: QuerySnapshot<DocumentData>
    ) {
      const channels: Channel[] = [];
      const myChannels: Channel[] = [];
      const joinedChannels: Channel[] = [];
      const exploreChannels: Channel[] = [];

      querySnapshot.forEach(async (doc) => {
        const channel = { id: doc.id, ...doc.data() } as Channel;

        const members = await this.loadChannelMembers(doc.id);

        channel.members = members;

        if (channel.ownerId === userId) {
          myChannels.push(channel);
        } else if (channel.memberIds.includes(userId!)) {
          joinedChannels.push(channel);
        } else {
          exploreChannels.push(channel);
        }

        channels.push(channel);
      });

      this.channels = channels;
      this.myChannels = myChannels;
      this.joinedChannels = joinedChannels;
      this.exploreChannels = exploreChannels;
    },
    async joinChannel(channelId: string, userId: string) {
      const membersRef = doc(db, "channels", channelId, "members", userId);
      const userRef = doc(db, "users", userId);
      runTransaction(db, async (transaction) => {
        const channelRef = doc(db, "channels", channelId);
        const channelRes = await transaction.get(channelRef);

        if (!channelRes.exists()) {
          throw new Error("Channel does not exist.");
        }

        const channel = {
          id: channelRes.id,
          ...channelRes.data(),
        } as Channel;

        if (!channel.memberIds.includes(userId)) {
          const newMemberIds = [...channel.memberIds, userId];

          const userDoc = await transaction.get(userRef);
          const user = userDoc.data() as User;
          const member = {
            id: user.id,
            name: user.firstName ?? "" + user.lastName ?? "",
            avatar: user.profilePic ?? "",
            isOnline: true,
          };
          transaction.update(channelRef, { memberIds: newMemberIds });
          transaction.set(membersRef, member);
        } else {
          throw new Error("User is already a member of the channel.");
        }
      });
    },
    async updateOwnerStatus(channelId: string, status: boolean) {
      const channelRef = doc(db, "channels", channelId);

      const data: Partial<Channel> = {
        ownerStatus: status,
      };
      await updateDoc(channelRef, data);
    },
    async setUserMemberStatus(
      channelId: string,
      userId: string,
      online: boolean
    ) {
      runTransaction(db, async (transaction) => {
        const channelRef = doc(db, "channels", channelId);
        const channelRes = await transaction.get(channelRef);

        if (!channelRes.exists()) {
          throw new Error("Channel does not exist.");
        }

        const channel = channelRes.data() as Channel;

        if (!channel.memberIds.includes(userId)) {
          throw new Error("You haven't joined the channel yet.");
        } else {
          const memberIdRef = doc(db, "channels", channelId, "members", userId);
          const memberRes = await transaction.get(memberIdRef);

          if (!memberRes.exists()) {
            throw new Error("You haven't joined the channel yet.");
          } else {
            const member = memberRes.data() as ChannelMembers;
            const updatedMember: ChannelMembers = {
              ...member,
              isOnline: online,
            };

            await transaction.set(memberIdRef, { ...updatedMember });
          }
        }
      });
    },

    // detach the listener when the component is about to be unmounted
    onBeforeUnmount() {
      const channelsRefQuery = query(collection(db, "channels"));
      onSnapshot(channelsRefQuery, (querySnapshot) => {});
    },
  },
});
