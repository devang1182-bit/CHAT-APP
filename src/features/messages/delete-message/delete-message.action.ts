import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import DeleteMessageService from "./delete-message.service";

export const DeleteMessageAction = createAsyncThunk(
  "message/deleteMessage",
  async (msgId: string, thunkAPI) => {
    try {
      console.log("Delete Message action ran");
      await DeleteMessageService(msgId);

      return "Message Deleted Successfully";
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
