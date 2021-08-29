import { addAlert } from "../redux/reducers/AlertsSlice";
import { updateBookmarks } from "../redux/reducers/BookmarksSlice";
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
import Alert from "../lib/alert";
import { NextRouter } from "next/router";

export const GetCurrentUser = async (
  dispatch: (arg0: { payload: any; type: string }) => void
) => {
  await fetch("https://api.strugl.cc/users/me", {
    method: "Get",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(async (res) => {
      if (res.ok) {
        const currentUser = await res.json();
        dispatch(logIn(currentUser));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetFeed = async (
  dispatch: (arg0: { payload: any; type: string }) => void
) => {
  dispatch(updateFeed([]));
  await fetch(`https://api.strugl.cc/posts/feed`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(async (res) => {
      if (res.ok) {
        const feed = await res.json();
        dispatch(updateFeed(feed));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetTopicsRecom = async (
  dispatch: (arg0: { payload: any; type: string }) => void
) => {
  dispatch(updateTopics([]));
  await fetch(`https://api.strugl.cc/recom/topics`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(async (res) => {
      if (res.ok) {
        const topics = await res.json();
        dispatch(updateTopics(topics));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetUsersRecom = async (
  dispatch: (arg0: { payload: any; type: string }) => void
) => {
  dispatch(updateUsers([]));
  await fetch(`https://api.strugl.cc/recom/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(async (res) => {
      if (res.ok) {
        const users = await res.json();
        dispatch(updateUsers(users));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetFollowings = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  id: number
) => {
  dispatch(updateFollowings([]));
  await fetch(`https://api.strugl.cc/followings/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(async (res) => {
      if (res.ok) {
        const followings = await res.json();
        dispatch(updateFollowings(followings));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetInterests = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  id: number
) => {
  dispatch(updateInterests([]));
  await fetch(`https://api.strugl.cc/interests/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(async (res) => {
      if (res.ok) {
        const interests = await res.json();
        dispatch(updateInterests(interests));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetBookmarks = async (
  dispatch: (arg0: { payload: any; type: string }) => void
) => {
  dispatch(updateBookmarks([]));
  await fetch(`https://api.strugl.cc/posts/bookmarks`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then(async (res) => {
      if (res.ok) {
        const bookmarks = await res.json();
        dispatch(updateBookmarks(bookmarks));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const GetTopicProfile = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  topic: string
) => {
  dispatch(updateTopicFeed([]));
  await fetch(`https://api.strugl.cc/topics/${topic}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(async (res) => {
      if (res.ok) {
        const topicProfile = await res.json();
        dispatch(addTopic(topicProfile));
      }
    })
    .catch((error) => {});

  await fetch(`https://api.strugl.cc/posts/topic/${topic}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(async (res) => {
      if (res.ok) {
        const posts = await res.json();
        dispatch(updateTopicFeed(posts));
      }
    })
    .catch((error) => {});
};

export const GetUserProfile = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  user: string,
) => {
  dispatch(updateProfileFeed([]));
  await fetch(`https://api.strugl.cc/users/name/${user}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(async (res) => {
      if (res.ok) {
        const userProfile = await res.json();
        dispatch(addUser(userProfile));
      }
    })
    .catch((error) => {});

  await fetch(`https://api.strugl.cc/posts/user/${user}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(async (res) => {
      if (res.ok) {
        const posts = await res.json();
        dispatch(updateProfileFeed(posts));
      }
    })
    .catch((error) => {});
};
