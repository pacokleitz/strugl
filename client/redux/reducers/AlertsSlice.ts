import { createSlice } from "@reduxjs/toolkit";
import Alert from "../../lib/alert";

interface Alerts {
  list: Array<Alert>;
}

const initialState: Alerts = { list: [] };

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
      };
    },

    removeAlert: (state, action) => {
      const list = state.list.filter(
        (alert) => alert.content !== action.payload
      );
      return { ...state, list: [...list] };
    },
  },
});

export const { updateAlerts, addAlert, removeAlert } = alertsSlice.actions;

export default alertsSlice.reducer;
