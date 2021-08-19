import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Topic from "../../lib/topic";

interface Interests {
  list: Array<Topic>;
}

const initialState: Interests = {
  list: [],
};

export const currentUserSlice = createSlice({
  name: "interests",

  initialState,

  reducers: {
    updateInterests: (state, action) => {
      return { ...state, list: [...action.payload] };
    },

    addInterest: (state, action) => {
      return { ...state, list: [action.payload, ...state.list] };
    },

    removeInterest: (state, action) => {
      const list = state.list.filter(
        (interest) => interest.topic_id !== action.payload
      );
      return { ...state, list: [...list] };
    },
  },
});

export const { updateInterests, addInterest, removeInterest } =
  currentUserSlice.actions;

export default currentUserSlice.reducer;
