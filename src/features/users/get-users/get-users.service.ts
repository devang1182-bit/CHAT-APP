import axios from "axios";

const GetUsersService = async () => {
  const response = await axios.get(`/api/get-users`);
  return response.data;
};

export default GetUsersService;