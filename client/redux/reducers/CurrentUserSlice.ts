import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    id: Number,
    username: String,
    email: String,
    followers: [{}],
    followings: [{}],
  },
  reducers: {
    auth: (state, action) => {
      const { id, username, email } = action.payload;
      state.id = id;
      state.username = username;
      state.email = email;
    },

    logOut: (state) => {
      state.id = Number;
      state.username = String;
      state.email = String;
      state.followers = [{}];
      state.followings = [{}];
    },
    follow: (state, action) => {
      state.followings.push(action.payload);
    },
    unfollow: (state, action) => {
      state.followings.splice(action.payload, 1);
    },
  },
});

export const { auth, follow, unfollow, logOut } = currentUserSlice.actions;

export default currentUserSlice.reducer;
