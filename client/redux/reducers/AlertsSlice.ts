import { createSlice } from "@reduxjs/toolkit";
import Alert from "../../lib/alert";

interface Alerts {
  list: Array<Alert>;
  length: number;
}

const initialState: Alerts = { list: [], length: 0 };

export const alertsSlice = createSlice({
  name: "alerts",

  initialState,

  reducers: {
    updateAlerts: (state, action) => {
      return { ...state, list: [...action.payload] };
    },
    addAlert: (state, action) => {
      return {
        ...state,
        list: [action.payload, ...state.list],
        length: state.length++,
      };
    },

    removeAlert: (state, action) => {
      const list = state.list.filter((post) => post.id !== action.payload);
      return { ...state, list: [...list], length: state.length-- };
    },
  },
});

export const { updateAlerts, addAlert, removeAlert } = alertsSlice.actions;

export default alertsSlice.reducer;
