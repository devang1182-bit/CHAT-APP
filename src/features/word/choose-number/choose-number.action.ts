import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ChooseNumberService } from "./choose-number.service";

export const ChooseNumberAction = createAsyncThunk(
  "targetNumber/chooseNumber",
  async (_,thunkAPI) => {
    try {
      const data = await ChooseNumberService.getNumber();
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
