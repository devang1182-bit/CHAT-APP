import axios from "axios";

export const ChooseNumberService = {
  getNumber: async () => {
    const response = await axios.get(
      `/api/choose-number`,
    );
    console.log(response.data);
    return response.data;
  },
};