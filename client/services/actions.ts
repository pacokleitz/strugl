import { NextRouter } from "next/router";

import { GetCurrentUser } from "./data";

import Post from "../lib/post";
import SearchResult from "../lib/searchResult";
import Topic from "../lib/topic";
import User from "../lib/user";

import { FormInputs } from "../components/feed";
import { FormInputs as ProfileForm } from "../pages/settings";

import { addBookmark, removeBookmark } from "../redux/reducers/BookmarksSlice";
import {
  logOut,
  updateAvatar,
  updateProfile,
} from "../redux/reducers/CurrentUserSlice";
import { addPost } from "../redux/reducers/FeedSlice";
import {
  changeUserRecomStyle,
  followUser,
} from "../redux/reducers/UsersRecommandationsSlice";
import {
  addFollowing,
  changeFollowingStyle,
  removeFollowing,
} from "../redux/reducers/FollowingsSlice";
import {
  addInterest,
  changeInterestStyle,
  removeInterest,
} from "../redux/reducers/InterestsSlice";
import { updateSearch } from "../redux/reducers/SearchSlice";
import {
  changeTopicRecomStyle,
  followTopic,
} from "../redux/reducers/TopicsRecommandationsSlice";
import {
  addAlert,
  changeStatus,
  removeAlert,
  updateAlerts,
} from "../redux/reducers/AlertsSlice";

export const CreateAccount = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  router: NextRouter,
  data: any
) => {
  await fetch("https://api.strugl.cc/users", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        dispatch(updateAlerts([]));
        router.push("/login", "/");
      } else {
        const err = await res.text();
        dispatch(
          addAlert({
            type: "error",
            content: err,
            color: "red",
            status: "In",
          })
        );
        setTimeout(() => {
          dispatch(changeStatus(err));
        }, 5000);
        setTimeout(() => {
          dispatch(removeAlert(err));
        }, 6000);
      }
    })
    .catch((error) => {
      console.log(error);
      router.push("/signup", "/");
    });
};

export const SignIn = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  router: NextRouter,
  data: any
) => {
  await fetch("https://api.strugl.cc/auth", {
    method: "Post",
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        dispatch(updateAlerts([]));
        await GetCurrentUser(dispatch).then(() => {
          router.push("/transition", "/");
        });
      } else {
        const err = await res.text();
        dispatch(
          addAlert({
            type: "error",
            content: err,
            color: "red",
            status: "In",
          })
        );
        setTimeout(() => {
          dispatch(changeStatus(err));
        }, 5000);
        setTimeout(() => {
          dispatch(removeAlert(err));
        }, 6000);
      }
    })
    .catch((error) => {
      console.log(error);
      router.push("/login", "/");
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
    .then(async () => {
      dispatch(logOut());
      router.push("/transition", "/");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const UpdateProfile = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  data: ProfileForm
) => {
  await fetch(`https://api.strugl.cc/users`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      if (res.ok) {
        dispatch(updateProfile(data));
        dispatch(
          addAlert({
            type: "success",
            content: "Profile updated",
            color: "green",
            status: "In",
          })
        );
        setTimeout(() => {
          dispatch(changeStatus("Profile updated"));
        }, 5000);
        setTimeout(() => {
          dispatch(removeAlert("Profile updated"));
        }, 6000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const UpdateAvatar = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  avatar: FormData
) => {
  await fetch(`https://api.strugl.cc/users/avatar`, {
    method: "PUT",
    credentials: "include",
    body: avatar,
  })
    .then(async (res) => {
      if (res.ok) {
        const dbAvatar = await res.text();
        dispatch(updateAvatar(dbAvatar));
        dispatch(
          addAlert({
            type: "success",
            content: "Avatar updated",
            color: "green",
            status: "In",
          })
        );
        setTimeout(() => {
          dispatch(changeStatus("Avatar updated"));
        }, 5000);
        setTimeout(() => {
          dispatch(removeAlert("Avatar updated"));
        }, 6000);
      }
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
        dispatch(changeTopicRecomStyle({ id: topic.topic_id, style: "Out" }));
        setTimeout(() => {
          dispatch(followTopic(topic.topic_id));
          dispatch(
            addInterest({
              topic_id: topic.topic_id,
              topic_name: topic.topic_name,
              style: "In",
            })
          );
        }, 1000);
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
      if (res.ok) {
        dispatch(changeInterestStyle({ id: id, style: "Out" }));
        setTimeout(() => {
          dispatch(removeInterest(id));
        }, 1000);
      }
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
        dispatch(changeUserRecomStyle({ id: user.id, style: "Out" }));
        setTimeout(() => {
          dispatch(followUser(user.id));
          dispatch(
            addFollowing({
              id: user.id,
              username: user.username,
              profile_name: user.profile_name,
              bio: user.bio,
              avatar: user.avatar,
              style: "In",
            })
          );
        }, 1000);
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
        dispatch(changeFollowingStyle({ id: user.id, style: "Out" }));
        setTimeout(() => {
          dispatch(removeFollowing(user.id));
        }, 1000);
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
  data: FormInputs,
  currentUser: User
) => {
  await fetch(`https://api.strugl.cc/posts`, {
    method: "Post",
    credentials: "include",
    body: JSON.stringify(data),
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
            content: data.content,
            date_created: new Date().toUTCString(),
            style: "fadeIn",
          })
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const Search = async (
  dispatch: (arg0: { payload: any; type: string }) => void,
  content: string
) => {
  await fetch(`https://api.strugl.cc/search/${content}`, {
    method: "Get",
    credentials: "include",
  })
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        const list: Array<SearchResult> = [];
        result.users.forEach((element: User) => {
          list.push({
            id: element.id,
            name: element.username,
            type: "user",
            avatar: element.avatar,
          });
        });
        result.topics.forEach((element: Topic) => {
          list.push({
            id: element.topic_id,
            name: element.topic_name,
            type: "topic",
          });
        });
        list.sort();
        dispatch(updateSearch(list));
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
