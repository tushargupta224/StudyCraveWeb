export default interface ChannelMembers {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  isOwner: true;
  isOnline: boolean;
  isJoined: boolean;
}
