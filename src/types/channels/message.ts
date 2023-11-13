import type { MessageTypeEnum } from "../../enum/message.enum";
import type Quiz from "./quiz/quiz";
import type QuizResponse from "./quiz/quiz_response";

export default interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  createdAt: string;
  timeStamp: string;
  type: MessageTypeEnum;
  quiz?: Quiz;
  quizResponse?: QuizResponse;
}
