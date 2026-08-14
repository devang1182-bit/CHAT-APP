import { createSlice } from "@reduxjs/toolkit";
import { ChooseNumberAction } from "./choose-number/choose-number.action";
import { INumber } from "./number.type";

const initialState: INumber = {
  number: null,
  userGuess: null,
  isLoading: false,
  error: undefined,
  result: null,
};

const NumberSlice = createSlice({
  name: "chooseWord",
  initialState,
  reducers: {
    playGame: (state, action) => {
      const userGuess = action.payload;
      const targetNumber: number | null = state.number;

      if (userGuess == targetNumber) {
        state.result = "You guessed the word correctly";
      } else if (targetNumber !== null && userGuess > targetNumber) {
        state.result = "Number is greater than the target";
      } else if (targetNumber !== null && userGuess < targetNumber) {
        state.result = "Number is smaller than the target";
      } else {
        state.result = `{state.error}`;
      }
    },

    reset: (state) => {
      state.number = null;
      state.userGuess = null;
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ChooseNumberAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.number = action.payload;
      })
      .addCase(ChooseNumberAction.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(ChooseNumberAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { playGame, reset } = NumberSlice.actions;
export default NumberSlice.reducer;
