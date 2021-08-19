import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import User from "../../lib/user";

interface CurrentUser {
  isLogged: boolean;
  userInfos: User;
}

const initialState: CurrentUser = {
  isLogged: false,
  userInfos: { id: -1, username: "", profile_name: "", bio: "", avatar: "" },
};

export const currentUserSlice = createSlice({
  name: "currentUser",

  initialState,

  reducers: {
    logIn: (state, action) => {
      return {
        ...state,
        ...{ userInfos: action.payload, isLogged: true },
      };
    },

    logOut: (state) => {
      return {
        ...state,
        ...{
          userInfos: {
            id: -1,
            username: "",
            profile_name: "",
            bio: "",
            avatar: "",
          },
          isLogged: false,
        },
      };
    },
  },
});

export const { logIn, logOut } = currentUserSlice.actions;

export default currentUserSlice.reducer;
