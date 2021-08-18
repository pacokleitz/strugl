import Topic from "../lib/topic";
import User from "../lib/user";
import {
  addFollowing,
  removeFollowing,
} from "../redux/reducers/FollowingsSlice";
import { addInterest, removeInterest } from "../redux/reducers/InterestsSlice";
import { followTopic } from "../redux/reducers/TopicsRecommandationsSlice";
import {
  addUsertoRecom,
  followUser,
} from "../redux/reducers/UsersRecommandationsSlice";

export const FollowTopic = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  topic: Topic
) => {
  await fetch(`https://api.strugl.cc/follow/topic/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ topic_id: topic.topic_id }),
  }).then(() => {
    dispatch(followTopic(topic.topic_id));
    dispatch(addInterest(topic));
  });
};

export const UnfollowTopic = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  id: number
) => {
  await fetch(`https://api.strugl.cc/unfollow/topic/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ topic_id: id }),
  }).then(() => {
    dispatch(removeInterest(id));
  });
};

export const FollowUser = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  user: User
) => {
  await fetch(`https://api.strugl.cc/follow/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id: user.id }),
  }).then(() => {
    dispatch(followUser(user.id));
    dispatch(addFollowing(user));
  });
};

export const UnfollowUser = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  user: User
) => {
  await fetch(`https://api.strugl.cc/unfollow/user/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id: user.id }),
  }).then(() => {
    dispatch(removeFollowing(user.id));
    dispatch(addUsertoRecom(user));
  });
};
