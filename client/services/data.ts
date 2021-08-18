import { logIn } from "../redux/reducers/CurrentUserSlice";
import {
  updateFeed,
  updateProfileFeed,
  updateTopicFeed,
} from "../redux/reducers/FeedSlice";
import { updateFollowings } from "../redux/reducers/FollowingsSlice";
import { updateInterests } from "../redux/reducers/InterestsSlice";
import { updateTopics } from "../redux/reducers/TopicsRecommandationsSlice";
import { addTopic } from "../redux/reducers/TopicsSlice";
import { updateUsers } from "../redux/reducers/UsersRecommandationsSlice";
import { addUser } from "../redux/reducers/UsersSlice";

export const GetFeed = async (
  dispatch: (arg0: { payload: any; type: string }) => void
) => {
  const res = await fetch(`https://api.strugl.cc/posts/feed`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const feed = await res.json();
  dispatch(updateFeed(feed));
};

export const GetTopicsRecom = async (
  dispatch: (arg0: { payload: any; type: string }) => void
) => {
  const res = await fetch(`https://api.strugl.cc/recom/topics`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const topics = await res.json();
  dispatch(updateTopics(topics));
};

export const GetUsersRecom = async (
  dispatch: (arg0: { payload: any; type: string }) => void
) => {
  const res = await fetch(`https://api.strugl.cc/recom/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const users = await res.json();
  dispatch(updateUsers(users));
};

export const GetCurrentUser = async (
  dispatch: (arg0: { payload: any; type: string }) => void
) => {
  const res = await fetch("https://api.strugl.cc/users/me", {
    method: "Get",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const currentUser = await res.json();
  dispatch(logIn(currentUser));
};

export const GetFollowings = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  id: number
) => {
  const res = await fetch(`https://api.strugl.cc/followings/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const followings = await res.json();
  dispatch(updateFollowings(followings));
};

export const GetInterests = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  id: number
) => {
  const res = await fetch(`https://api.strugl.cc/interests/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const interests = await res.json();
  dispatch(updateInterests(interests));
};

export const GetTopicProfile = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  topic: string
) => {
  let res = await fetch(`https://api.strugl.cc/topics/${topic}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const topicProfile = await res.json();
  dispatch(addTopic(topicProfile));

  res = await fetch(`https://api.strugl.cc/posts/topic/${topic}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const posts = await res.json();
  dispatch(updateTopicFeed(posts));
};

export const GetUserProfile = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  user: string
) => {
  let res = await fetch(`https://api.strugl.cc/users/name/${user}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const userProfile = await res.json();
  dispatch(addUser(userProfile));

  res = await fetch(`https://api.strugl.cc/posts/user/${user}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const posts = await res.json();
  dispatch(updateProfileFeed(posts));
};
