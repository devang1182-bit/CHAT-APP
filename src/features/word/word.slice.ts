import { createSlice } from "@reduxjs/toolkit";
import { ChooseWordAction } from "./choose-word/choose-word.action";
import { IWord } from "./word.type";

const initialState: IWord = {
  word: null,
  isLoading: false,
  error: undefined,
  playerVal: null,
  playerScore: 0,
  compScore: 0,
};

const WordSlice = createSlice({
  name: "chooseWord",
  initialState,
  reducers: {
    playGame : (state , action) => {

      const userValue = action.payload
      state.playerVal =  userValue

      const computerVal = state.word

      if (state.playerVal == state.word) {
        
        console.log("Match Tied");

      } else if (
        (userValue == "ROCK" && computerVal == "SCISSORS") ||
        (userValue == "PAPER" && computerVal == "ROCK") ||
        (userValue == "SCISSORS" && computerVal == "PAPER")
      ) {
        
        state.playerScore += 1

      } else {
        state.compScore +=1
      }
    },

    reset :(state) => {
      state.word = null;
      state.playerScore = 0;
      state.compScore = 0;
      state.playerVal = null
    }

  },

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

export const {playGame , reset} = WordSlice.actions
export default WordSlice.reducer;
