import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import GetMessagesService from "./get-message.service";

export const GetMessagesAction = createAsyncThunk(
  "messages/getMessages",
  async (roomId: string, thunkAPI) => {
    try {
      console.log("Message action ran");
      const data = await GetMessagesService(roomId);

      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message;

        return thunkAPI.rejectWithValue(errorMessage);
      }

      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }

      return thunkAPI.rejectWithValue(
        "An unexpected error occurred",
      );
    }
  },
);