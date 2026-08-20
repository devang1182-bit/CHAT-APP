import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, MessageState } from "./messages.type";
import { GetMessagesAction } from "./get-message/get-message.action";

const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "message",

  initialState,

  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },

    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },

    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages = [...state.messages , action.payload];
      console.log(state.messages, "Messages in local storage");
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(GetMessagesAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(GetMessagesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        console.log(action.payload);
      })

      .addCase(GetMessagesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages, setMessages, addMessage } = messageSlice.actions;

export default messageSlice.reducer;
