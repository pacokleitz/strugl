import { createSlice } from "@reduxjs/toolkit";
import Post from "../../lib/post";

interface Bookmarks {
  list: Array<Post>;
}

const initialState: Bookmarks = { list: [] };

export const bookmarksSlice = createSlice({
  name: "bookmarks",

  initialState,

  reducers: {
    updateBookmarks: (state, action) => {
      return { ...state, list: [...action.payload] };
    },
    addBookmark: (state, action) => {
      return { ...state, list: [action.payload, ...state.list] };
    },

    removeBookmark: (state, action) => {
      const list = state.list.filter((post) => post.id !== action.payload);
      return { ...state, list: [...list] };
    },
  },
});

export const { updateBookmarks, addBookmark, removeBookmark } =
  bookmarksSlice.actions;

export default bookmarksSlice.reducer;
