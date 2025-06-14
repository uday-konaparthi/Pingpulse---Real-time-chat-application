import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  token: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.loading = false;
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token)
    },
    logout(state) {
      state.userInfo = null;
      state.token = null;
      state.error = null;
      localStorage.clear()
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
