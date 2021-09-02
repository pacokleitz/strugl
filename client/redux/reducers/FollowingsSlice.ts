import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import User from "../../lib/user";

interface Followings {
  list: Array<User>;
}

const initialState: Followings = { list: [] };

export const followingsSlice = createSlice({
  name: "followings",

  initialState,
  reducers: {
    updateFollowings: (state, action) => {
      return { ...state, list: [...action.payload] };
    },
    addFollowing: (state, action) => {
      return { ...state, list: [action.payload, ...state.list] };
    },

    removeFollowing: (state, action) => {
      const list = state.list.filter(
        (following) => following.id !== action.payload
      );
      return { ...state, list: [...list] };
    },

    changeFollowingStyle: (state, action) => {
      const { id, style } = action.payload;
      const following = state.list.find((following) => following.id === id);
      if (following) following.style = style;
    },
  },
});

export const {
  updateFollowings,
  addFollowing,
  removeFollowing,
  changeFollowingStyle,
} = followingsSlice.actions;

export default followingsSlice.reducer;
