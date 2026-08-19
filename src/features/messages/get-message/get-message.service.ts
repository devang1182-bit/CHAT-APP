import axios from "axios";
import { Message } from "../messages.type";

const GetMessagesService = async (
  roomId: string,
): Promise<Message[]> => {
   console.log("Message service ran");
  const response = await axios.get<Message[]>(
    `/api/get-messages?roomId=${roomId}`,
  );

  return response.data;
};

export default GetMessagesService;