import { combineReducers } from "redux";

import usersReducer from "./UsersSlice";
import currentUserReducer from "./CurrentUserSlice";
import usersRecommandationsReducer from "./UsersRecommandationsSlice";
import topicsRecommandationsReducer from "./TopicsRecommandationsSlice";
import followingsReducer from "./FollowingsSlice";
import interestsReducer from "./InterestsSlice";
import bookmarksReducer from "./BookmarksSlice";
import feedReducer from "./FeedSlice";
import topicsReducer from "./TopicsSlice";
import alertReducer from "./AlertSlice";
import searchReducer from "./SearchSlice";

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  followings: followingsReducer,
  interests: interestsReducer,
  bookmarks: bookmarksReducer,
  usersRecommandations: usersRecommandationsReducer,
  topicsRecommandations: topicsRecommandationsReducer,
  feed: feedReducer,
  users: usersReducer,
  topics: topicsReducer,
  alert: alertReducer,
  search: searchReducer,
});

export default rootReducer;
