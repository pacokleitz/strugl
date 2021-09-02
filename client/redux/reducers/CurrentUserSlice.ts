import {
  bindActionCreators,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
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

    updateProfile: (state, action) => {
      const { profile_name, bio } = action.payload;
      state.userInfos.bio = bio;
      state.userInfos.profile_name = profile_name;
    },

    updateAvatar: (state, action) => {
      state.userInfos.avatar = action.payload;
    },
  },
});

export const { logIn, logOut, updateProfile, updateAvatar } =
  currentUserSlice.actions;

export default currentUserSlice.reducer;
