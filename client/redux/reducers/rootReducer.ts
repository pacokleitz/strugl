import { combineReducers } from "redux";
import usersReducer from "./UsersSlice";

const rootReducer = combineReducers({
  users: usersReducer,
});

export default rootReducer;
