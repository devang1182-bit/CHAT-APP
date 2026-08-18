import axios from "axios";
import { Message } from "../messages.type";

const GetMessagesService = async (
  roomId: string,
): Promise<Message[]> => {
  const response = await axios.get<Message[]>(
    `/api/messages?roomId=${encodeURIComponent(roomId)}`,
  );

  return response.data;
};

export default GetMessagesService;