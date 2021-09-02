import { createSlice } from "@reduxjs/toolkit";
import User from "../../lib/user";

interface Users {
  list: Array<User>;
}
const initialState: Users = {
  list: [],
};
export const usersRecommandationsSlice = createSlice({
  name: "usersRecommandations",

  initialState,

  reducers: {
    updateUsers: (state, action) => {
      return { ...state, list: [...action.payload] };
    },

    followUser: (state, action) => {
      const list = state.list.filter((user) => user.id !== action.payload);
      return { ...state, list: [...list] };
    },

    addUsertoRecom: (state, action) => {
      return { ...state, list: [action.payload, ...state.list] };
    },

    changeUserRecomStyle: (state, action) => {
      const { id, style } = action.payload;
      const following = state.list.find((following) => following.id === id);
      if (following) following.style = style;
    },
  },
});

export const { updateUsers, followUser, addUsertoRecom, changeUserRecomStyle } =
  usersRecommandationsSlice.actions;

export default usersRecommandationsSlice.reducer;
