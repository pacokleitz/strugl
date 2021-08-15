import React, { useEffect } from "react";
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
  return (
    <div className="pt-2 col-span-3 space-y-2">
      <div className="pb-2 flex flex-row px-6 justify-start items-center space-x-8 focus:outline-none">
        <p className="inline-block text-4xl text-center font-semibold text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
          {"#" + props.topic}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow p-4 flex justify-around items-center">
        <a className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon icon={faBars} className="w-5" />
            <p>Posts</p>
          </div>
          <p>{props.postsList.length}</p>
        </a>
        <a className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
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
  return (
    <div className="pt-2 col-span-3 space-y-2">
      <div className="pb-2 flex flex-row px-6 justify-start items-center space-x-8 focus:outline-none">
        {props.user.avatar && (
          <img
            src={props.user.avatar}
            className="w-32 rounded-full bg-white ring-2 ring-gray-300 self-center"
          />
        )}
        {
          <img
            src="/default.svg"
            className="w-32 rounded-full bg-white ring-2 ring-gray-300 self-center"
          />
        }
        <p className="inline-block text-xl text-center font-semibold text-gray-700 group-hover:text-gray-900 subpixel-antialiased">
          {props.user}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow p-4 flex justify-around items-center">
        <a className="flex flex-row justify-between space-x-16 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon icon={faUsers} className="w-5" />
            <p>Friends</p>
          </div>
          <p>28</p>
        </a>
        <a className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
          <div className="flex flex-row justify-between space-x-2">
            <FontAwesomeIcon icon={faStar} className="w-5" />
            <p>Interests</p>
          </div>
          <p>3</p>
        </a>
        <a className="flex flex-row justify-between space-x-10 text-sm font-semibold text-gray-600 hover:text-gray-400 cursor-pointer">
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

export default function Profile({ postsList, topicsList, usersList }: any) {
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
          <UserProfileContent postsList={postsList} user={profile} />
        )}
        <div className="lg:block hidden">
          <Suggestions topicsList={topicsList} usersList={usersList} />
        </div>
      </div>
    </div>
  );
}

Profile.getInitialProps = async (ctx: NextPageContext) => {
  // Profile posts fetch
  let url = ``;

  if (ctx.query.profile && ctx.query.profile[0] == "topic") {
    url = `https://api.strugl.cc/posts/topic/${ctx.query.profile[1]}`;
  } else {
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
  const topics = await res.json();

  res = await fetch(`https://api.strugl.cc/recom/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const users = await res.json();

  return { postsList: posts, topicsList: topics, usersList: users };
};
