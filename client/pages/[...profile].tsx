import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import {
  GetCurrentUser,
  GetFollowings,
  GetInterests,
  GetTopicProfile,
  GetTopicsRecom,
  GetUserProfile,
  GetUsersRecom,
} from "../services/data";
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
import { updateSearch } from "../redux/reducers/SearchSlice";

function TopicProfileContent(props: any) {
  const dispatch = useAppDispatch();

  const isLogged = useAppSelector((state) => state.currentUser.isLogged);
  const feed = useAppSelector((state) => state.feed);
  const topicProfile = useAppSelector((state) =>
    state.topics.list.find((topic) => topic.topic_name === props.topic)
  );
  const isStarred = useAppSelector((state) =>
    state.interests.list.find((topic) => props.topic === topic.topic_name)
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
        <p className="inline-block text-4xl text-center font-semibold text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
          {"#" + props.topic}
        </p>
        {isLogged && (
          <div
            className={
              "px-4 py-1 border-2 text-md font-semibold rounded-3xl cursor-pointer " +
              (!isStarred
                ? "border-gray-700 text-gray-700 hover:border-yellow-400 hover:text-yellow-400"
                : "border-yellow-400 text-yellow-400 hover:border-yellow-500 hover:text-yellow-500")
            }
            onClick={Star}
          >
            {isStarred ? "Starred" : "Star"}
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow p-4 flex justify-around items-center">
        <a className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 hover:text-gray-800 cursor-pointer">
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
    state.followings.list.find((user) => user.username === props.user)
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
              className="w-32 rounded-full bg-gray-200 ring-2 ring-gray-200 self-center"
            />
          )}
          {!userProfile?.avatar && (
            <div className="w-32 h-32 rounded-full bg-gray-200 ring-2 ring-gray-200 self-center"></div>
          )}
          <p className="inline-block text-xl text-center font-semibold text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
            {userProfile?.username}
          </p>
        </div>
        {isLogged && currentUser.username != userProfile?.username && (
          <div
            className={
              "px-4 py-1 border-2 text-md font-semibold rounded-3xl cursor-pointer " +
              (!isFollowed
                ? "border-gray-700 text-gray-700 hover:border-indigo-500 hover:text-indigo-500"
                : "border-indigo-500 text-indigo-500 hover:border-indigo-700 hover:text-indigo-700")
            }
            onClick={Follow}
          >
            {isFollowed ? "Followed" : "Follow"}
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow p-4 flex justify-around items-center">
        <a className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 hover:text-gray-800 cursor-pointer">
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

export default function Profile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile } = router.query;

  const isLogged = useAppSelector((state) => state.currentUser.isLogged);
  const currentUserId = useAppSelector(
    (state) => state.currentUser.userInfos.id
  );
  const alert = useAppSelector((state) => state.alerts.list[0]);

  useEffect(() => {
    GetFollowings(dispatch, currentUserId);
    GetInterests(dispatch, currentUserId);
    GetCurrentUser(dispatch);

    if (profile) {
      if (profile?.length == 2) GetTopicProfile(dispatch, profile[1]);
      else GetUserProfile(dispatch, profile[0]);
    }
  });

  return (
    <div className="fixed min-h-screen h-auto w-screen max-w-full bg-gray-100 ">
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
          "pt-16 max-w-7xl min-w-screen px-4 m-auto gap-4 justify-between pb-4 " +
          (isLogged ? "lg:grid lg:grid-cols-4 gap-4" : "")
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
