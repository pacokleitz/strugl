import Post from "../lib/post";
import Topic from "../lib/topic";
import User from "../lib/user";

import { addBookmark, removeBookmark } from "../redux/reducers/BookmarksSlice";
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
  })
    .then((res) => {
      if (res.ok) {
        dispatch(followTopic(topic.topic_id));
        dispatch(addInterest(topic));
      }
    })
    .catch((error) => {
      console.log(error);
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
  })
    .then((res) => {
      if (res.ok) dispatch(removeInterest(id));
    })
    .catch((error) => {
      console.log(error);
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
  })
    .then((res) => {
      if (res.ok) {
        dispatch(followUser(user.id));
        dispatch(addFollowing(user));
      }
    })
    .catch((error) => {
      console.log(error);
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
  }).then((res) => {
    if (res.ok) {
      dispatch(removeFollowing(user.id));
      dispatch(addUsertoRecom(user));
    }
  });
};

export const AddBookmark = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  post: Post
) => {
  await fetch(`https://api.strugl.cc/posts/bookmarks/${post.id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((res) => {
      if (res.ok) dispatch(addBookmark(post));
    })
    .catch((error) => {
      console.log(error);
    });
};

export const RemoveBookmark = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  id: number
) => {
  await fetch(`https://api.strugl.cc/posts/bookmarks/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((res) => {
      if (res.ok) dispatch(removeBookmark(id));
    })
    .catch((error) => {
      console.log(error);
    });
};
