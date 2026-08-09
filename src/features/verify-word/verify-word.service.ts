import axios from "axios";

export const VerifyWordService = {
  verifyWord: async (searchWord:string) => {
    const response = await axios.get(
      `/api/verify-word?searchWord=${searchWord}`,
    );
    return response.data;
  },
};