import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./user.type";
import { GetUsersAction } from "./get-users/get-users.action";
import { GetCurrentUserAction } from "./get-current-user/get-current-user.action";

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(GetUsersAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUsersAction.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload
        console.log(state.users)
      })
      .addCase(GetUsersAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(GetCurrentUserAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetCurrentUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload ?? null;
        // console.log(state.currentUser, "Current User");
      })
      .addCase(GetCurrentUserAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = usersSlice.actions;
export default usersSlice.reducer;
