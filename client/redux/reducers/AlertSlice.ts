import { createSlice } from "@reduxjs/toolkit";
import Alert from "../../lib/alert";

const initialState: Alert = { content: "", type: "", color: "", status: "" };

export const alertSlice = createSlice({
  name: "alert",

  initialState,

  reducers: {
    updateAlert: (state, action) => {
      return { ...state, ...action.payload };
    },

    changeStatus: (state) => {
      state.status = "Out";
    },

    removeAlert: (state) => {
      return { ...state, ...{ content: "", type: "", color: "", status: "" } };
    },
  },
});

export const { updateAlert, changeStatus, removeAlert } = alertSlice.actions;

export default alertSlice.reducer;
