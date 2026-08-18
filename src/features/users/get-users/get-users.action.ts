import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import GetUsersService from "./get-users.service";

export const GetUsersAction = createAsyncThunk(
  "users/getUsers",
  async (_, thunkAPI) => {
    try {
      const data = await GetUsersService();
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

