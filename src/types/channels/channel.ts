import type ChannelMembers from "./channel_member";

export default interface Channel {
  id: string;
  name: string;
  topic: string;
  description: string;
  ownerId: string;
  ownerDisplayName: string;
  ownerAvatar?: string;
  ownerStatus: boolean;
  memberIds: string[];
  members: ChannelMembers[];
  createdAt: string;
  maxMembersLimit: number;
  deletedAt?: string;
}
