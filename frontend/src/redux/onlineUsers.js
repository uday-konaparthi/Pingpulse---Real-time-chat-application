// redux/onlineUsers.js
import { createSlice } from "@reduxjs/toolkit";

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState: {
    users: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
