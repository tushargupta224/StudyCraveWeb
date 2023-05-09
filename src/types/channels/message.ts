import type { FieldValue } from "firebase/firestore";

export default interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  createdAt: string;
  timeStamp: string;
}
