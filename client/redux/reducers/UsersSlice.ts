import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
  name: "users",
  initialState: [{}],
  reducers: {
    addUser: (state, action) => {
      state.push(action.payload);
    },
    removeUser: (state, action) => {
      state.splice(action.payload, 1);
    },
  },
});

export const { addUser, removeUser} = usersSlice.actions;

export default usersSlice.reducer;
