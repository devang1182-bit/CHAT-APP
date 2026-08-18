export type Message = {
  id: string;
  roomId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: string;
};

export type MessageState = {
  messages: Message[];
  loading: boolean;
  error: string | null;
};