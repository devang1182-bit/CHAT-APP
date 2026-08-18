import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import GetCurrentUserService from "./get-current-user.service";

export const GetCurrentUserAction = createAsyncThunk(
  "currentUser/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const data = await GetCurrentUserService();
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(errorMessage);
      }

      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      } else {
        console.error("An unexpected error occurred", error);
      }
    }
  },
);
