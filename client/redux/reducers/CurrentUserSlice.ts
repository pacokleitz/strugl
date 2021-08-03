import { createSlice } from "@reduxjs/toolkit";

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    id: -1,
    username: null,
    email: null,
    followers: [{}],
    followings: [{}],
    posts: [{}],
  },
  reducers: {
    auth: (state, action) => {
      state = action.payload;
    },
    logOut: (state) => {
      state.id = -1;
      state.username = null;
      state.email = null;
      state.followers = [{}];
      state.followings = [{}];
      state.posts = [{}];
    },
    follow: (state, action) => {
      state.followings.push(action.payload);
    },
    unfollow: (state, action) => {
      state.followings.splice(action.payload, 1);
    },
  },
});

export const { auth, follow, unfollow, logOut } =
  currentUserSlice.actions;

export default currentUserSlice.reducer;
