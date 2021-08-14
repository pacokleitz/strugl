import { combineReducers } from "redux";
import usersReducer from "./UsersSlice";
import currentUserReducer from "./CurrentUserSlice";

const rootReducer = combineReducers({
  users: usersReducer,
  currentUser: currentUserReducer,
});

export default rootReducer;
