import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { useAppSelector } from "../redux/hooks";

import Feed from "../components/feed";
import Header from "../components/header";
import Suggestions from "../components/suggestions";
import Alert from "../components/alert";

import {
  faBars,
  faBookmark,
  faStar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TopicProfileContent(props: any) {
  const [addState] = useState(["Star", "Starred"]);
  let [currentaddState, setCurrentaddState] = useState(0);
  let currentAdd = addState[currentaddState];

  async function Star() {
    if (currentaddState == 0) {
      setCurrentaddState((currentaddState = 1));
      await fetch(`https://api.strugl.cc/follow/topic/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: props.topic.topic_id }),
      });
    } else {
      setCurrentaddState((currentaddState = 0));
      await fetch(`https://api.strugl.cc/unfollow/topic/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: props.topic.topic_id }),
      });
    }
  }

  return (
    <div className="pt-2 col-span-3 space-y-2">
      <div className="pb-2 flex flex-row px-6  items-center space-x-8 focus:outline-none justify-between">
        <p className="inline-block text-4xl text-center font-semibold text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
          {"#" + props.topic}
        </p>
        <div
          className={
            "px-4 py-1 border-2 text-md font-semibold rounded-3xl cursor-pointer " +
            (currentaddState == 0
              ? "border-gray-700 text-gray-700 hover:border-yellow-400 hover:text-yellow-400"
              : "border-yellow-400 text-yellow-400 hover:border-yellow-500 hover:text-yellow-500")
          }
          onClick={Star}
        >
          {currentAdd}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4 flex justify-around items-center">
        <a className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 hover:text-gray-800 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon icon={faBars} className="w-5" />
            <p>Posts</p>
          </div>
          <p>{props.postsList.length}</p>
        </a>
        <a className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-800 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon icon={faStar} className="w-5" />
            <p>Followers</p>
          </div>
          <p>3</p>
        </a>
      </div>
      <Feed feedType="topicFeed" postsList={props.postsList} />
    </div>
  );
}

function UserProfileContent(props: any) {
  const currentUser = useAppSelector((state) => state.currentUser);

  const [addState] = useState(["Follow", "Followed"]);
  let [currentaddState, setCurrentaddState] = useState(0);
  let currentAdd = addState[currentaddState];

  async function Follow() {
    if (currentaddState == 0) {
      setCurrentaddState((currentaddState = 1));
      await fetch(`https://api.strugl.cc/follow/user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: props.user.id }),
      });
    } else {
      setCurrentaddState((currentaddState = 0));
      await fetch(`https://api.strugl.cc/unfollow/user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: props.user.id }),
      });
    }
  }

  return (
    <div className="pt-2 col-span-3 space-y-2">
      <div className="pb-2 flex flex-row px-6 justify-between focus:outline-none items-center">
        <div className="flex justify-start items-center space-x-8">
          {props.user.avatar && (
            <img
              src={props.user.avatar}
              className="w-32 rounded-full bg-white ring-2 ring-gray-300 self-center"
            />
          )}
          {!props.user.avatar && (
            <img
              src="/default.svg"
              className="w-32 rounded-full bg-white ring-2 ring-gray-300 self-center"
            />
          )}
          <p className="inline-block text-xl text-center font-semibold text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
            {props.user.username}
          </p>
        </div>
        {currentUser.username != props.user.username && (
          <div
            className={
              "px-4 py-1 border-2 text-md font-semibold rounded-3xl cursor-pointer " +
              (currentaddState == 0
                ? "border-gray-700 text-gray-700 hover:border-indigo-500 hover:text-indigo-500"
                : "border-indigo-500 text-indigo-500 hover:border-indigo-700 hover:text-indigo-700")
            }
            onClick={Follow}
          >
            {currentAdd}
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow p-4 flex justify-around items-center">
        <a className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 hover:text-gray-800 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon icon={faBars} className="w-5" />
            <p>Posts</p>
          </div>
          <p>{props.postsList.length}</p>
        </a>
        <a className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-800 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon icon={faStar} className="w-5" />
            <p>Interests</p>
          </div>
          <p>3</p>
        </a>
        <a className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-800 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon
              icon={faBookmark}
              className="w-5 h-4 self-center"
            />
            <p>Bookmarks</p>
          </div>
          <p>31</p>
        </a>
      </div>
      <Feed feedType="profileFeed" postsList={props.postsList} />
    </div>
  );
}

export default function Profile({
  user,
  postsList,
  topicsList,
  usersList,
}: any) {
  const router = useRouter();
  const { profile } = router.query;

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
      {/* {!postsList && profile == currentUser.username && (
        <Alert
          state="suggestion"
          msg="You have no post yet. Create a new post to fill your profile"
          color="blue"
        />
      )} */}
      <div className="pt-16 max-w-full min-w-screen lg:grid lg:grid-cols-4 px-4 m-auto gap-4 justify-between pb-4">
        {profile && profile[0] == "topic" && (
          <TopicProfileContent postsList={postsList} topic={profile[1]} />
        )}
        {profile && profile[0] != "topic" && (
          <UserProfileContent postsList={postsList} user={user} />
        )}
        <div className="lg:block hidden">
          {topicsList && usersList && (
            <Suggestions topicsList={topicsList} usersList={usersList} />
          )}
        </div>
      </div>
    </div>
  );
}

Profile.getInitialProps = async (ctx: NextPageContext) => {
  let userProfile;

  // Profile posts fetch
  let url = ``;

  if (ctx.query.profile && ctx.query.profile.length == 2) {
    url = `https://api.strugl.cc/posts/topic/${ctx.query.profile[1]}`;
    userProfile = null;
  } else {
    let res = await fetch(
      `https://api.strugl.cc/users/name/${ctx.query.profile}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    userProfile = await res.json();
    url = `https://api.strugl.cc/posts/user/${ctx.query.profile}`;
  }

  let res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const posts = await res.json();

  // Suggestions fetch
  res = await fetch(`https://api.strugl.cc/recom/topics`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  let topics: any;
  if (res.ok) {
    topics = await res.json();
  } else topics = null;

  res = await fetch(`https://api.strugl.cc/recom/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  let users: any;
  if (res.ok) {
    users = await res.json();
  } else users = null;

  return {
    user: userProfile,
    postsList: posts,
    topicsList: topics,
    usersList: users,
  };
};
