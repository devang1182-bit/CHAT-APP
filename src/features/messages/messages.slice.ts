import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, MessageState } from "./messages.type";

const initialState: MessageState = {
  messages: [],
  total: 0,
  page: 1,
  limit: 10,
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
      state.messages.push(action.payload);
    },
  },
});

export const { clearMessages, setMessages, addMessage } = messageSlice.actions;

export default messageSlice.reducer;
