import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    currentUser: null,
    friends: [{}],
  },
  reducers: {
    auth: (state, action) => {
      state.currentUser = action.payload;
    },
    logOut: (state) => {
      state.currentUser = null;
      state.friends = [];
    },
    addUser: (state, action) => {
      state.friends.push(action.payload);
    },
    removeUser: (state, action) => {
      state.friends.splice(action.payload, 1);
    },
  },
});

export const { auth, addUser, removeUser, logOut } = usersSlice.actions;

export default usersSlice.reducer;
