import { createSlice } from "@reduxjs/toolkit";
import Topic from "../../lib/topic";

interface Topics {
  list: Array<Topic>;
}

const initialState: Topics = {
  list: [],
};

export const topicsSlice = createSlice({
  name: "topics",

  initialState,

  reducers: {
    addTopic: (state, action) => {
      return { ...state, list: [action.payload, ...state.list] };
    },

    removeTopic: (state, action) => {
      const list = state.list.filter(
        (topic) => topic.topic_id !== action.payload
      );
      return { ...state, list: [...list] };
    },

    
  },
});

export const { addTopic, removeTopic } = topicsSlice.actions;

export default topicsSlice.reducer;
