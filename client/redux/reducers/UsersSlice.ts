import { createSlice } from "@reduxjs/toolkit";
import User from "../../lib/user";

interface Users {
  list: Array<User>;
}

const initialState: Users = {
  list: [],
};

export const usersSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    addUser: (state, action) => {
      return { ...state, list: [action.payload, ...state.list] };
    },
    
    removeUser: (state, action) => {
      const list = state.list.filter((user) => user.id !== action.payload);
      return { ...state, list: [...list] };
    },
  },
});

export const { addUser, removeUser } = usersSlice.actions;

export default usersSlice.reducer;
