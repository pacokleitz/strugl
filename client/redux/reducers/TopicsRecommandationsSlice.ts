import { createSlice } from "@reduxjs/toolkit";
import Topic from "../../lib/topic";

interface Topics {
  list: Array<Topic>;
}

const initialState: Topics = {
  list: [],
};

export const topicsRecommandationsSlice = createSlice({
  name: "topicsRecommandations",

  initialState,

  reducers: {
    updateTopics: (state, action) => {
      return { ...state, list: [...action.payload] };
    },

    followTopic: (state, action) => {
      const list = state.list.filter(
        (topic) => topic.topic_id !== action.payload
      );
      return { ...state, list: [...list] };
    },

    addTopictoRecom: (state, action) => {
      return { ...state, list: [action.payload, ...state.list] };
    },
  },
});

export const { updateTopics, addTopictoRecom, followTopic } =
  topicsRecommandationsSlice.actions;

export default topicsRecommandationsSlice.reducer;
