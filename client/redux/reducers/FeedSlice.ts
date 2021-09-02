import { createSlice } from "@reduxjs/toolkit";
import Post from "../../lib/post";

interface Feed {
  type: string;
  list: Array<Post>;
}

const initialState: Feed = {
  type: "",
  list: [],
};

export const feedSlice = createSlice({
  name: "feed",

  initialState,

  reducers: {
    updateFeed: (state, action) => {
      return {
        ...state,
        list: [...action.payload],
        type: "dashboardFeed",
      };
    },

    updateProfileFeed: (state, action) => {
      return {
        ...state,
        list: [...action.payload],
        type: "profileFeed",
      };
    },

    updateTopicFeed: (state, action) => {
      return {
        ...state,
        list: [...action.payload],
        type: "topicFeed",
      };
    },

    updateBookmarksFeed: (state, action) => {
      return {
        ...state,
        list: [...action.payload],
        type: "bookmarksFeed",
      };
    },

    addPost: (state, action) => {
      return { ...state, list: [action.payload, ...state.list] };
    },

    removePost: (state, action) => {
      const list = state.list.filter((post) => post.id !== action.payload.id);
      return { ...state, list: [...list] };
    },
  },
});

export const {
  updateFeed,
  updateProfileFeed,
  updateTopicFeed,
  updateBookmarksFeed,
  removePost,
  addPost,
} = feedSlice.actions;

export default feedSlice.reducer;
