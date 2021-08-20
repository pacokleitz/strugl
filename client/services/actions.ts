import { NextRouter } from "next/router";
import { FormInputs } from "../components/feed";
import Alert from "../lib/alert";
import Post from "../lib/post";
import Topic from "../lib/topic";
import User from "../lib/user";
import { addAlert } from "../redux/reducers/AlertsSlice";

import { addBookmark, removeBookmark } from "../redux/reducers/BookmarksSlice";
import { logOut } from "../redux/reducers/CurrentUserSlice";
import { addPost } from "../redux/reducers/FeedSlice";
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
import { GetCurrentUser } from "./data";

export const CreateAccount = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  router: NextRouter,
  data: any,
) => {
  await fetch("https://api.strugl.cc/users", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        router.push("/");
      }
    })
    .catch((error) => {
      dispatch(addAlert(new Alert("error", error)));
    });
};

export const SignIn = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  router: NextRouter,
  data: any,
) => {
  await fetch("https://api.strugl.cc/auth", {
    method: "Post",
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        GetCurrentUser(dispatch);
        router.push("/dashboard", "/");
      }
    })
    .catch((error) => {
      console.log(error);
      dispatch(addAlert(new Alert("error", error)));
    });
};

export const SignOut = async (
  dispatch: (arg0: { payload: undefined; type: string }) => void,
  router: NextRouter
) => {
  await fetch(`https://api.strugl.cc/auth/logout`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(() => {
      dispatch(logOut());
      router.push("/");
    })
    .catch((error) => {
      console.log(error);
    });
};

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
  })
    .then((res) => {
      if (res.ok) {
        dispatch(removeFollowing(user.id));
        dispatch(addUsertoRecom(user));
      }
    })
    .catch((error) => {
      console.log(error);
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

export const AddPost = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  content: FormInputs,
  currentUser: User
) => {
  await fetch(`https://api.strugl.cc/posts`, {
    method: "Post",
    credentials: "include",
    body: JSON.stringify(content),
  })
    .then(async (res) => {
      if (res.ok) {
        const id = await res.text();
        dispatch(
          addPost({
            id: parseInt(id),
            author: currentUser.username,
            author_id: currentUser.id,
            avatar: currentUser.avatar,
            content: content,
            date_created: new Date().toUTCString(),
            style: "state2",
          })
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
