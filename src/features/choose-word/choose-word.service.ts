import axios from "axios";

export const ChooseWordService = {
  getWord: async () => {
    const response = await axios.get(
      `/api/choose-word`,
    );
    return response.data;
  },
};