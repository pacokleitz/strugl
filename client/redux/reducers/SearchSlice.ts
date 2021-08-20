import { createSlice } from "@reduxjs/toolkit";
import SearchResult from "../../lib/searchResult";

interface Search {
  list: Array<SearchResult>;
}

const initialState: Search = { list: [] };

export const searchSlice = createSlice({
  name: "search",

  initialState,

  reducers: {
    updateSearch: (state, action) => {
      return { ...state, list: [...action.payload] };
    },
  },
});

export const { updateSearch } = searchSlice.actions;

export default searchSlice.reducer;
