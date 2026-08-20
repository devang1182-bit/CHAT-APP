import axios from "axios";

const DeleteMessageService = async (msgId: string) => {
  console.log("Delete Message service ran");
  await axios.get(`/api/delete-message?msgId=${msgId}`);
  return "Message Deleted Successfully";
};

export default DeleteMessageService;
