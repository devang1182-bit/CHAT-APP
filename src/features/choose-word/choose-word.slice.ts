import { createSlice } from "@reduxjs/toolkit";
import { ChooseWordAction } from "./choose-word.action";
import { IWord } from "./choose-word.type";

const initialState: IWord = {
  word: null,
  isLoading: false,
  error: undefined,
};

const chooseWordSlice = createSlice({
  name: "chooseWord",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(ChooseWordAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.word = action.payload;
      })
      .addCase(ChooseWordAction.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(ChooseWordAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default chooseWordSlice.reducer;
