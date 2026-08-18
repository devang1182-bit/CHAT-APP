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
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
};