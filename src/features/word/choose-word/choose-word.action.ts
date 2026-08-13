import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ChooseWordService } from "./choose-word.service";

export const ChooseWordAction = createAsyncThunk(
  "targetWord/chooseWord",
  async (_,thunkAPI) => {
    try {
      const data = await ChooseWordService.getWord();
      console.log(data);
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
