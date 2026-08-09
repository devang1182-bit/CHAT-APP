import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { VerifyWordService } from "./verify-word.service";

export const VerifyWordAction = createAsyncThunk(
  "word/searchWord",
  async (searchWord:string ,thunkAPI) => {
    try {
      const data = await VerifyWordService.verifyWord(searchWord);

      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;

        return thunkAPI.rejectWithValue(errorMessage);
      }

      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      return thunkAPI.rejectWithValue("An unexpected error occurred");
    }
  },
);
