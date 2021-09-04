import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateSearch } from "../redux/reducers/SearchSlice";

import { GetTopicProfile, GetUserProfile, GetFeed } from "../services/data";
import {
  FollowTopic,
  FollowUser,
  UnfollowTopic,
  UnfollowUser,
} from "../services/actions";

import Feed from "../components/feed";
import Header from "../components/header";
import Suggestions from "../components/suggestions";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Alert from "../components/alert";

function TopicProfileContent(props: any) {
  const dispatch = useAppDispatch();

  const isLogged = useAppSelector((state) => state.currentUser.isLogged);
  const feed = useAppSelector((state) => state.feed);
  const topicProfile = useAppSelector((state) =>
    state.topics.list.find(
      (topic) => topic.topic_name === props.topic.toLowerCase()
    )
  );
  const isStarred = useAppSelector((state) =>
    state.interests.list.find(
      (topic) => props.topic.toLowerCase() === topic.topic_name
    )
  );

  function Star() {
    if (topicProfile)
      isStarred
        ? UnfollowTopic(dispatch, topicProfile.topic_id)
        : FollowTopic(dispatch, topicProfile);
  }

  return (
    <div className="pt-2 space-y-2">
      <div className="pb-2 flex flex-row px-6  items-center space-x-8 focus:outline-none justify-between">
        <p className="inline-block text-4xl text-center font-semibold text-gray-700 dark:text-gray-300 subpixel-antialiased">
          {"#" + props.topic}
        </p>
        {isLogged && (
          <div
            className={
              "px-4 py-1 border-2 text-md font-semibold rounded-3xl cursor-pointer " +
              (!isStarred
                ? "border-gray-700 text-gray-700 dark:text-gray-300 dark:border-gray-300 hover:border-yellow-400 hover:text-yellow-400 dark:hover:border-yellow-400 dark:hover:text-yellow-400"
                : "border-yellow-400 text-yellow-400 hover:border-yellow-500 hover:text-yellow-500")
            }
            onClick={Star}
          >
            {isStarred ? "Starred" : "Star"}
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-gray-850 rounded-xl shadow p-4 flex justify-around items-center">
        <a className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-850 dark:hover:text-gray-200 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon icon={faBars} className="w-5" />
            <p>Posts</p>
          </div>
          <p>{feed.list.length}</p>
        </a>
      </div>
      <Feed feed={feed} />
    </div>
  );
}

function UserProfileContent(props: any) {
  const dispatch = useAppDispatch();

  const isLogged = useAppSelector((state) => state.currentUser.isLogged);
  const userProfile = useAppSelector((state) =>
    state.users.list.find((user) => user.username === props.user)
  );

  const feed = useAppSelector((state) => state.feed);
  const currentUser = useAppSelector((state) => state.currentUser.userInfos);
  const isFollowed = useAppSelector((state) =>
    state.followings.list.find(
      (user) => user.username === props.user.toLowerCase()
    )
  );

  function Follow() {
    if (userProfile)
      isFollowed
        ? UnfollowUser(dispatch, userProfile)
        : FollowUser(dispatch, userProfile);
  }

  return (
    <div className="pt-2 col-span-3 space-y-2">
      <div className="pb-2 flex flex-row px-6 justify-between focus:outline-none items-center">
        <div className="flex justify-start items-center space-x-8">
          {userProfile?.avatar && (
            <img
              src={userProfile.avatar}
              className="w-32 h-32 rounded-full bg-gray-200 ring-2 ring-gray-200 self-center dark:bg-gray-800 dark:ring-gray-800 object-contain"
            />
          )}
          {!userProfile?.avatar && (
            <div className="w-32 h-32 rounded-full bg-gray-200 ring-2 ring-gray-200 self-center"></div>
          )}
          <div className="flex flex-col items-start">
            {!userProfile?.profile_name && (
              <div className="mb-4 h-6 w-44 rounded-xl bg-white dark:bg-gray-850 animate-pulse text-white dark:text-gray-850 text-center"></div>
            )}

            {userProfile?.profile_name && (
              <p className="text-xl text-center font-semibold text-gray-700 dark:text-gray-300 subpixel-antialiased">
                {userProfile.profile_name}
              </p>
            )}
            {!userProfile?.username && (
              <div className="h-6 w-32 rounded-xl bg-white dark:bg-gray-850 animate-pulse"></div>
            )}
            {userProfile?.username && (
              <p className="text-md text-center font-medium italic text-gray-500 subpixel-antialiased">
                {"@" + userProfile.username}
              </p>
            )}
          </div>
        </div>
        {isLogged && currentUser.username != userProfile?.username && (
          <div
            className={
              "px-4 py-1 border-2 text-md font-semibold rounded-3xl cursor-pointer " +
              (!isFollowed
                ? "border-gray-700 text-gray-700 dark:border-gray-300 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-500 dark:hover:border-indigo-500 dark:hover:text-indigo-500"
                : "border-indigo-500 text-indigo-500 hover:border-indigo-700 hover:text-indigo-700")
            }
            onClick={Follow}
          >
            {isFollowed ? "Followed" : "Follow"}
          </div>
        )}
      </div>
      <div className="bg-white dark:bg-gray-850 rounded-xl shadow p-4 flex justify-around items-center">
        {!userProfile?.bio && (
          <div className="h-6 w-11/12 rounded-xl bg-gray-100 dark:bg-gray-850 animate-pulse text-white dark:text-gray-950 text-center"></div>
        )}
        {userProfile?.bio.length == 0 && (
          <a className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-850 dark:hover:text-gray-200 cursor-pointer">
            <div className="flex flex-row justify-between space-x-2">
              <FontAwesomeIcon icon={faBars} className="w-5" />
              <p>Posts</p>
            </div>
            <p>{feed.list.length}</p>
          </a>
        )}
        {userProfile && userProfile?.bio.length > 0 && (
          <div className="w-full justify-center flex flex-row text-sm font-medium text-gray-600 dark:text-gray-300 space-x-2">
            <p>{userProfile?.bio}</p>
          </div>
        )}
      </div>
      <Feed feed={feed} />
    </div>
  );
}

export default function Profile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile } = router.query;

  const isLogged = useAppSelector((state) => state.currentUser.isLogged);
  const alert = useAppSelector((state) => state.alerts.list[0]);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (profile) {
      if (profile?.length == 2) GetTopicProfile(dispatch, profile[1]);
      else GetUserProfile(dispatch, profile[0]);
    }

    router.beforePopState(({ url, as }) => {
      if (as === "/" && isLogged) {
        GetFeed(dispatch);
        router.push(url, "/");
        return false;
      } else {
        router.push("/transition", "/");
        return true;
      }
    });
  });

  return (
    <div
      className="fixed min-h-screen h-auto w-screen max-w-full bg-gray-100 dark:bg-gray-950"
      onClick={() => dispatch(updateSearch([]))}
    >
      <Head>
        {profile && profile[0] == "topic" && (
          <title>Strugl - {"#" + profile[1]}</title>
        )}
        {profile && profile[0] != "topic" && <title>Strugl - {profile}</title>}

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div
        className={
          "pt-20 min-w-screen px-4 m-auto gap-4 justify-between pb-4 " +
          (isLogged ? "lg:grid lg:grid-cols-4 gap-4 max-w-7xl" : "max-w-5xl")
        }
      >
        {alert && <Alert alert={alert} />}
        {profile && profile[0] == "topic" && (
          <div className={isLogged ? "col-span-3" : ""}>
            <TopicProfileContent topic={profile[1]} />
          </div>
        )}
        {profile && profile[0] != "topic" && (
          <UserProfileContent user={profile[0]} />
        )}
        <div className="lg:block hidden">{isLogged && <Suggestions />}</div>
      </div>
    </div>
  );
}
