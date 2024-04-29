export interface ISessionParticipants {
  id?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaStreamId: string;
  audioEnabled: boolean;
  videoEnabled: boolean;
  updatedAt?: string;
}
